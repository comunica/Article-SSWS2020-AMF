function getBindings(triplePatterns, context) {
  for ((triplePattern, amf) in (triplePatterns, context.amfs))
    for position in ['subject', 'predicate', 'object']
      if ((!triplePattern[position].isVariable()
          && !amf[position].contains(triplePattern.subject))
        return new EmptyStream();
  return super.getBindings(bgpPatterns, context);
}