function getBindings(triplePatterns, amfs) {
  for ((triplePattern, amf) in (triplePatterns, amfs))
    for position in ['subject', 'predicate', 'object']
      if ((!triplePattern[position].isVariable()
          && !amf[position].filter(triplePattern.subject))
        return new EmptyStream();
  return super.getBindings(bgpPatterns, amfs);
}