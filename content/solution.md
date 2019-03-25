## Solution
{:#solution}

The AMF approach requires changes on both server-side as client-side,
and our contributions adapt parts of both aspect.
For both aspects, we discuss the pre-existing approaches
and our contributions hereafter.

### Server-side metadata generation

The original TPF server extension by [Vander Sande et al.](cite:cites amf2015)
allowed both Bloom filters and GCS to be created on-the-fly for any triple pattern.
These filters would be added out-of-band as metadata to TPFs.
We extended this implementation with three new features.

First, since we want to evaluate whether or not including AMF metadata in-band
can reduce the total number of HTTP requests and query execution times,
we implemented a way to emit this metadata in-band if the triple count of the given pattern is below a certain configurable threshold.
Originally, all AMF metadata would always be emitted out-of-band,
which requires an additional HTTP request for clients.
This threshold should not be set too high, as large AMFs will introduce some overhead for clients
that do not need or do not understand AMF metadata.

Secondly, in order to measure the server overhead of large AMFs,
we added a config option to dynamically enable AMFs for triple patterns
with number of matching triples below a given threshold.

Finally, we implemented a (disableable) file-based cache to avoid recomputing AMFs
to make pre-computation of AMFs possible.

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

One problem with the above solutions is that certain AMFs can get quite big.
In cases where there are not many bindings that need to be filtered,
the time it takes to download the AMF might be greater than simply not using the filter at all.

For cases like this we added a heuristic that checks whether it might be a good idea to download the filter.
To handle cases like this, 
we created a heuristic that estimates both the time it would take to accept all the bindings,
and the time it would take to download an AMF for the given amount of triples.
Based on those estimates a choice gets made on whether to request the metadata or not.
Our heuristic is quite simple as will be shown later,
and serves more to indicate that there is still much potential there for future work.
