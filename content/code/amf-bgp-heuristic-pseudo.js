function preferAmfForBgp(bindingsCount, triplePatternsCardinality) {
  totalAmfsSize = triplePatternsCardinality.sum() * AMF_TRIPLE_SIZE;
  joinRequestData = (bindingsCount * triplePatternsCardinality.length)
      * TPF_BINDING_SIZE;
  return totalAmfsSize < joinRequestData;
}
