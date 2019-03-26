function isBgpAmfEffective(bindingsCount, triplePatternCounts) {
  totalAmfsSize = triplePatternCounts.sum() * AMF_TRIPLE_SIZE;
  joinRequestData = (bindingsCount * triplePatternCounts.length)
      * TPF_BINDING_SIZE;
  return totalAmfsSize < joinRequestData;
}