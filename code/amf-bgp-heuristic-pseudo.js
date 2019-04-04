function preferAmfForBgp(bindingsCount, triplePatternMatches) {
  totalAmfsSize = triplePatternMatches.sum() * AMF_TRIPLE_SIZE;
  joinRequestData = (bindingsCount * triplePatternMatches.length)
      * TPF_BINDING_SIZE;
  return totalAmfsSize < joinRequestData;
}