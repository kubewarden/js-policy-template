#!/usr/bin/env bats

@test "reject because hostname is on deny list" {
  run kwctl run annotated-policy.wasm -r test_data/pod_with_hostname.json --settings-json '{"denied_hostnames": ["forbidden-host", "test-hostname"]}'

  # this prints the output when one the checks below fails
  echo "output = ${output}"

  # request rejected
  [ "$status" -eq 0 ]
  [ $(expr "$output" : '.*allowed.*false') -ne 0 ]
  [ $(expr "$output" : ".*Pod hostname 'test-hostname' is not allowed.*") -ne 0 ]
}

@test "accept because hostname is not on the deny list" {
  run kwctl run annotated-policy.wasm -r test_data/pod_with_hostname.json --settings-json '{"denied_hostnames": ["forbidden-host"]}'
  
  # this prints the output when one the checks below fails
  echo "output = ${output}"

  # request accepted
  [ "$status" -eq 0 ]
  [ $(expr "$output" : '.*allowed.*true') -ne 0 ]
}

@test "accept because the deny list is empty" {
  run kwctl run annotated-policy.wasm -r test_data/pod_with_hostname.json
  
  # this prints the output when one the checks below fails
  echo "output = ${output}"

  # request accepted
  [ "$status" -eq 0 ]
  [ $(expr "$output" : '.*allowed.*true') -ne 0 ]
}

@test "accept because pod has no hostname set" {
  run kwctl run annotated-policy.wasm -r test_data/pod.json --settings-json '{"denied_hostnames": ["forbidden-host"]}'
  
  # this prints the output when one the checks below fails
  echo "output = ${output}"

  # request accepted (no hostname to check)
  [ "$status" -eq 0 ]
  [ $(expr "$output" : '.*allowed.*true') -ne 0 ]
}

@test "accept non-pod resources" {
  run kwctl run annotated-policy.wasm -r test_data/pod.json --settings-json '{"denied_hostnames": ["forbidden-host"]}'
  
  # this prints the output when one the checks below fails
  echo "output = ${output}"

  # request accepted (not a pod)
  [ "$status" -eq 0 ]
  [ $(expr "$output" : '.*allowed.*true') -ne 0 ]
}