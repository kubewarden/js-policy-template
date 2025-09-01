# js-policy-template

This is a template repository you can use to scaffold a Kubewarden policy written in TypeScript or JavaScript.

Don't forget to check Kubewarden's
[official documentation](https://docs.kubewarden.io)
for more information about writing policies.

## Introduction

This repository has a working policy written in TypeScript.

The policy looks at the `hostname` of a Kubernetes Pod (`spec.hostname`) and rejects the request if the hostname is on the deny list.

The deny list is configurable by the user via the runtime settings of the policy.

You express the configuration of the policy using this structure:

```yaml
{
  "denied_hostnames": [ "bad-host", "forbidden-host" ]
}
```

To build the policy into a WebAssembly module, run:
```yaml
make all
```

## Code organization
`src/types.ts` - defines the TypeScript interfaces for policySettigns and Kubernetes resources
  - This policy makes use of [Kubernetes TypeScript types](https://github.com/silverlyra/kubernetes-types), which provides Kubernetes resource definitions for TypeScript. It may be useful when building other JavaScript/TypeScript policies.

`src/index.ts` - contains the full policy implementation:
- Parsing the incoming validation request
- Extracting the Kubernetes resource and Pod hostname
- Enforcing the deny list logic
- Validating the policy settings
- Executing the policy action

## Implementation details

> **DISCLAIMER:** WebAssembly is a constantly evolving area.
> This document describes the status of the JavaScript/TypeScript ecosystem as of August 2025.

Kubewarden policies written in JavaScript or TypeScript rely on the [Kubewarden JavaScript SDK](https://github.com/kubewarden/policy-sdk-js). The SDK provides helper functions for working with [Kubewarden's host capabilities](https://docs.kubewarden.io/reference/spec/host-capabilities/intro-host-capabilities).

Policies are compiled to WebAssembly using Kubewarden's [`javy`](https://github.com/bytecodealliance/javy) plugin. The plugin is installed as part of the `kubewarden-policy-sdk` package and can be found under:

```yaml
node_modules/kubewarden-policy-sdk/plugin
```
## Testing

It is important to test the final result of the Javy compilation:
the actual WebAssembly module.

This is done with a set of end-to-end tests.
These tests use the `kwctl` cli provided by the Kubewarden project to load and execute the policy.

The e2e tests are implemented using
[bats](https://github.com/bats-core/bats-core),
the Bash Automated Testing System.

The end-to-end tests are defined in the `e2e.bats` file and can be run using:

```console
make e2e
```

## Required Development Tools
- [TypeScript](https://www.typescriptlang.org)
- [Webpack](https://webpack.js.org)
- [Prettier](https://prettier.io)
- [Node.js](https://nodejs.org)
- Make 
- [bats (Bash Automated Testing System)](https://github.com/bats-core/bats-core)
- [kwctl](https://github.com/kubewarden/kwctl/releases)
- [javy](https://github.com/bytecodealliance/javy)
- [kubewarden-policy-sdk](https://github.com/kubewarden/policy-sdk-js)
- [kubernetes-types](https://github.com/silverlyra/kubernetes-types)