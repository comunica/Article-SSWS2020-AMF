function hasTriple(triple, context) {
  for position in ['subject', 'predicate', 'object']
    if !context.amf[position].contains(triple[position])
      return false;
  return super.hasTriple(triple, context);
}