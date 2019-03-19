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
The server-side implementation is mostly based on the [implementation by Vander Sande et al.](cite:cites amf2015)
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
The main changes in this paper are how we made us of the AMF metadata to improve the client-side querying.
For this we developed two new query algorithms that use the metadata on BGP level,
the results of which are shown in [](#evaluation).

In the [original AMF algorithm](cite:cites amf2015),
bindings only got filtered when a pattern would be fully bound.
The main idea behind our new algorithm is to already do this filtering much sooner in the querying process.
The added advantage is that fewer bindings have to be sent to the server,
at the cost of generating more filters.

[](#tpf) shows how the original TPF algorithm works.
For the specific details we refer the reader to the [original paper](cite:cites ldf).
Our additions to the algorithm can be found in [](#amf-bgp-pseudo).
The code here is quite simplified,
more specific details on how we added this to Comunica can be found in [](#solution).

<figure id="tpf" class="listing">
````/code/tpf.js````
<figcaption markdown="block">
Original TPF algorithm. More details can be found in the [original paper](cite:cites ldf).
</figcaption>
</figure>

<figure id="amf-bgp-pseudo" class="listing">
````/code/amf-bgp-pseudo.js````
<figcaption markdown="block">
Updated algorithm with AMF code.
</figcaption>
</figure>

The main idea is that all new bindings first get filtered through all applicable AMFs.
Although this is simplified in [](#amf-bgp-pseudo),
only the AMFs that filter over variables that are contained in the new bindings are applied.
This also means that should the filters be provided out-of-band,
only the necessary filters will be downloaded.
In the end, the result is that many unnecessary server requests will be avoided due to the filtering,
as will be shown in [](#evaluation).

#### Reducing inefficient AMF usage

talk about the heuristic to not use large AMFs
{:.todo}


