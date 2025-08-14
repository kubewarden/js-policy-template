import { Validation, writeOutput, } from 'kubewarden-policy-sdk';
import { PolicySettings, KubernetesResource, PodSpec, } from './types';

type ValidationRequest = Validation.Validation.ValidationRequest;

declare function policyAction(): string;

/**
 * Safely parses and extracts the Kubernetes resource from the validation request.
 *
 * @param {ValidationRequest} validationRequest - The validation request object.
 * @returns {KubernetesResource | undefined} The parsed Kubernetes resource if available.
 */
function getKubernetesResource(validationRequest: ValidationRequest): KubernetesResource | undefined {
  try {
    let requestObject: string | KubernetesResource | undefined = validationRequest.request?.object;

    if (typeof requestObject === 'string') {
      requestObject = JSON.parse(requestObject) as unknown as KubernetesResource;
    } else if (requestObject === undefined) {
      return undefined;
    }

    return requestObject as KubernetesResource;
  } catch (error) {
    console.error('Error parsing Kubernetes resource:', error);
    return undefined;
  }
}

/**
 * Extracts the hostname from a Pod resource.
 *
 * @param {KubernetesResource} resource - The Kubernetes resource.
 * @returns {string | undefined} The hostname if set, otherwise undefined.
 */
function getPodHostname(resource: KubernetesResource): string | undefined {
  // Only process Pod resources
  if (resource.kind !== 'Pod') {
    return undefined;
  }

  const podSpec = resource.spec as PodSpec;
  return podSpec?.hostname;
}

/**
 * Validates the incoming request against policy settings.
 * Accepts or rejects the request based on denied hostnames.
 */
function validate(): void {
  try {
    const validationRequest = Validation.Validation.readValidationRequest();
    const settings: PolicySettings = validationRequest.settings || {};
    const resource = getKubernetesResource(validationRequest);

    if (!resource) {
      writeOutput(Validation.Validation.rejectRequest('Failed to parse Kubernetes resource.'));
      return;
    }

    // Only validate Pod resources
    if (resource.kind !== 'Pod') {
      writeOutput(Validation.Validation.acceptRequest());
      return;
    }

    const hostname = getPodHostname(resource);
    const deniedHostnames = settings.denied_hostnames || [];

    // If no hostname is set, accept the request
    if (!hostname) {
      writeOutput(Validation.Validation.acceptRequest());
      return;
    }

    if (deniedHostnames.includes(hostname)) {
      writeOutput(
        Validation.Validation.rejectRequest(
          `Pod hostname '${hostname}' is not allowed. Denied hostnames: [${deniedHostnames.join(', ')}]`
        ),
      );
    } else {
      writeOutput(Validation.Validation.acceptRequest());
    }
  } catch (err) {
    console.error('Validation error:', err);
    writeOutput(Validation.Validation.rejectRequest(`Validation failed: ${err}`));
  }
}

/**
 * Validates the policy settings themselves to ensure they are structured correctly.
 */
function validateSettings(): void {
  try {
    const response = new Validation.Validation.SettingsValidationResponse(true);
    writeOutput(response);
  } catch (err) {
    console.error('Settings validation error:', err);
    const errorResponse = new Validation.Validation.SettingsValidationResponse(
      false,
      `Settings validation failed: ${err}`,
    );
    writeOutput(errorResponse);
  }
}

const action = policyAction();

switch (action) {
  case 'validate':
    validate();
    break;
  case 'validate-settings':
    validateSettings();
    break;
  default:
    console.error('Unknown action:', action);
    writeOutput(new Validation.Validation.ValidationResponse(false, 'Unknown policy action'));
}