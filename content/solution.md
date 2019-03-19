## Solution
{:#solution}

Describe how the AMF stuff is used and how the algorithm looks like.
Focus on the 2 triple algorithms and heuristic.
{:.todo}

To make use of AMFs for more efficient TPF querying,
there are two places where changes need to be made:
the server needs to generate and expose the new metadata,
and the client needs to incorporate it in the query algorithm.

### Server-side metadata generation
The server-side implementation is mostly based on the [implementation by Vander Sande et al.](cite:cutes amf2015)
Some additions were made though, such as when an AMF gets generated and how they get returned.

The first change that was made is for which patterns AMFs get generated.
Previously this was only for patterns with a single variable,
but we made the server more flexible in that regard:
now we allow the server to generate AMFs for any patterns,
based on limitations given in the server config file.
The two available limitations are variable count and triple count:
AMFs will be generated for each pattern of which the number of variables
and/or the total number of results is at most the given values.
This allows the client to use the AMF metadata in more situations than before.

A second addition was the option of allowing AMFs to be sent out-of-band.
This means that the server only returns a URL to where the actual AMF result can be found.
The advantage there is that this reduces both the response size and the effort needed to generate an AMF
in cases where it is not required.
It is also possible to combine this with the previous change,
i.e., have two sets of limits: if the pattern exceeds the first limit only out-of-band AMF becomes available,
and after the second one there is no AMF option at all.
This allows servers to provide metadata for larger triples,
but still prevents the more extreme edge cases from slowing everything down.

Finally we also added an internal cache:
all generated AMFs are stored in an LRU cache,
meaning the more popular pattern metadata gets stored in memory.
This greatly cuts down on the time needed to actually generate that metadata.

### Client-side query algorithm