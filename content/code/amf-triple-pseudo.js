function hasTriple(triple, amf) {
  for position in ['subject', 'predicate', 'object']
    if amf[position].filter(triple[position])
      return false;
  return super.hasTriple(triple, amf);
}