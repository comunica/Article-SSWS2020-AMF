function hasTriple(triple, amf) {
  if (!amf.subject.filter(triple.subject)
   || !amf.predicate.filter(triple.predicate)
   || !amf.object.filter(triple.object)) {
    return false;
  }
  return super.hasTriple(triple, amfs);
}