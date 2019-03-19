function solve (patterns) {
  const smallestIdx = /* find i where patterns[i].totalItems is the smallest */
  const bindingsStream = getBindings(patterns[smallestIdx]);
  const remainingPatterns = patterns.remove(smallestIdx);
  if (remainingPatterns.isEmpty())
    return bindingsStream;

  const resultStream = /* empty stream */
  for (let bindings of bindingsStream) {

    // ----- AMF -----
    let valid = true;
    for (let pattern of mappedPatterns)
      valid = pattern.amf.check(bindings);
    if (!valid)
      continue;
    // ----- AMF -----

    const mappedPatterns = applyBindings(remainingPatterns, bindings);
    solve(mappedPatterns).pipe(resultStream);
  }
  return resultStream;
}