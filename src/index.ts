import { Validation, writeOutput } from 'kubewarden-policy-sdk';

declare function policyAction(): string;

/**
 * Interface representing policy settings structure.
 */
interface PolicySettings {
  // List of pod names that are denied by the policy.
  denied_names?: string[];
}

/**
 * Extracts the pod name from the validation request.
 *
 * @param {any} validationRequest - The validation request object.
 * @returns {string | undefined} The pod name if available, otherwise undefined.
 */
function getPodName(validationRequest: any): string | undefined {
  try {
    let requestObject = validationRequest.request?.object;

    if (typeof requestObject === 'string') {
      requestObject = JSON.parse(requestObject);
    }

    return requestObject?.metadata?.name;
  } catch (error) {
    console.error('Error parsing request object:', error);
    return undefined;
  }
}

/**
 * Validates the incoming request against policy settings.
 * Accepts or rejects the request based on denied pod names.
 */
function validate(): void {
  try {
    const validationRequest = Validation.Validation.readValidationRequest();
    const settings: PolicySettings = validationRequest.settings || {};
    const podName = getPodName(validationRequest);

    if (!podName) {
      writeOutput(Validation.Validation.rejectRequest('Missing pod name in the request.'));
      return;
    }

    const deniedNames = settings.denied_names || [];

    if (deniedNames.includes(podName)) {
      writeOutput(
        Validation.Validation.rejectRequest(`The '${podName}' name is on the deny list.`),
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
