function getBindings(triplePatterns, amfs) {
  for ((triplePattern, amf) in (triplePatterns, amfs)) {
    if ((!triplePattern.subject.isVariable()
        && !amf.subject.filter(triplePattern.subject))
     || (!triplePattern.predicate.isVariable()
        && !amf.predicate.filter(triplePattern.predicate))
     || (!triplePattern.object.isVariable()
        && !amf.object.filter(triplePattern.object))) {
        return new EmptyStream();
      }
    }
  }
  return super.getBindings(bgpPatterns, amfs);
}