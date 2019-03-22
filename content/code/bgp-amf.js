function solve (patterns) {
  for (pattern in patterns) {
    for (boundValue in pattern) {
      if (!pattern.parentAMF.check(boundValue))
        return;
    }
  }
  
  return bgpMediator.call(patterns);
}