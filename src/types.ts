/**
 * Interface representing policy settings structure.
 */
export interface PolicySettings {
  // List of hostnames that are denied by the policy.
  denied_hostnames?: string[];
}

/**
 * Native Kubernetes object metadata interface
 */
export interface KubernetesMetadata {
  name?: string;
  namespace?: string;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
}

/**
 * Pod spec interface focusing on hostname
 */
export interface PodSpec {
  hostname?: string;
  subdomain?: string;
  containers: Array<{
    name: string;
    image: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

/**
 * Generic Kubernetes resource interface
 */
export interface KubernetesResource {
  apiVersion: string;
  kind: string;
  metadata: KubernetesMetadata;
  spec?: PodSpec | any; // Can be extended for other resource types
}

/**
 * Validation request interface
 */
// export interface ValidationRequest {
//   request: {
//     kind: {
//       group: string;
//       version: string;
//       kind: string;
//     };
//     object: KubernetesResource | string;
//     oldObject?: KubernetesResource | string;
//   };
//   settings: PolicySettings;
// }