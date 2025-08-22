import type { PodSpec } from 'kubernetes-types/core/v1';
import type { ObjectMeta } from 'kubernetes-types/meta/v1';

/**
 * Interface representing policy settings structure.
 */
export interface PolicySettings {
  // List of hostnames that are denied by the policy.
  denied_hostnames?: string[];
}

/**
 * Generic Kubernetes resource interface
 */
export interface KubernetesResource {
  apiVersion: string;
  kind: string;
  metadata: ObjectMeta;
  spec?: PodSpec | any; // Can be extended for other resource types
}
