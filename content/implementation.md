## Implementation
{:#implementation}

In this section, we discuss the implementations of the client-side algorithms
that were discussed in [](#solution), and our server-side extensions.

Anonymize source code links
{:.todo}

### Client-side Implementation in Comunica

For our implementation, we make use of [Comunica](cite:cites comunica),
which is a highly modular SPARQL querying framework in JavaScript.
Comunica uses an _actor-based_ architecture to achieve loose coupling between modules.
Each actor is responsible for solving a certain task in a certain way.
Actors can be registered on task-specific _buses_.
If a certain task needs to be solved, _mediators_ are responsible for picking the _best_ actors in that bus,
and letting that actor execute the task.
Comunica offers more than 100 actors that, when combined, are able to solve complex SPARQL queries.
This combination is achieved using [Components.js](cite:cites componentsjs),
a dependency injection framework that works with semantic configuration files.

As Comunica already fully supports the TPF algorithm out-of-the-box,
it significantly lowered the barrier for implementing our client-side AMF algorithms in this framework.
Its modular structure makes it ideal for us to add on to the existing implementation,
without having to change the existing code base.
Following the conventions of Comunica,
we also wrote extensive unit tests to test the correctness of our implementation.

Concretely, we introduce one new bus, and seven new actors.
They are implemented in separate Comunica modules,
and are available open-source on [GitHub](https://github.com/comunica/comunica-feature-amf){:.mandatory}.

* AMF Bus: Bus for actors that can construct AMFs.
* Bloom AMF Actor: Actor for constructing Bloom filters.
* GCS AMF Actor: Actor for constructing GCS filters.
* AMF Metadata Extractor Actor: Actor that extracts AMF metadata and instantiates AMFs.
* AMF Quad Pattern Actor: An AMF-aware quad pattern actor.
* AMF BGP Actor: An AMF-aware BGP actor.
* Combined AMF BGP Actor: An AMF-aware BGP actor that pre-fetches AMFs.

The first four modules are responsible for interpreting the AMF metadata,
and the last three modules make use of the detected AMFs during query evaluation.
As Comunica works with RDF _quads_ instead of RDF _triples_,
all algorithms that were introduced in [](#solution) were generalized to this model.
We will discuss both groups hereafter.

#### AMF Metadata Detection

The AMF Bus is responsible for holding actors that can instantiate AMFs of a certain type
based on a set of properties.
These properties contain things such as the type of AMF,
the binary AMF data as was provided by the server,
and the variable for which the AMF applies.
For this bus, we implemented two actors, which respectively implement Bloom filters and GCS.

Next to this, we also implemented and actor to extract AMF metadata,
which we registered to the already existing metadata extraction bus in Comunica.
This actor will receive RDF quads as input,
and it will detect any AMF metadata.
Based on the detected AMF metadata, it will instantiate all relevant AMFs using the AMF Bus,
and add these instances to Comunica's shared query context, so that it can be used later on during query evaluation.

#### AMF Query Evaluation

The _AMF Quad Pattern Actor_ implements the triple-based AMF algorithm
by registering onto the quad pattern bus.
This actor is only active for quad patterns that are fully materialized quads,
and when AMFs are present in the shared query context.

The _AMF BGP Actor_ implements our new BGP-based AMF algorithm,
which registers onto the BGP bus.
This also implements our heuristic where the constants are configurable.
This actor is active for all BGPs, but only if AMFs are present in the shared query context.

We also implemented a _Combined AMF BGP Actor_,
that is an improvement to the _AMF BGP Actor_
that actively pre-fetches all AMFs that are out-of-band.
This can slightly improve performance when multiple patterns exist in the BGP that all have AMFs,
because HTTP requests are parallelized.

### Server Extensions in Server.js

The original TPF server extension in [Server.js](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf){:.mandatory}
by [Vander Sande et al.](cite:cites amf2015)
allowed both Bloom filters and GCS to be created on the fly for any triple pattern.
These filters would be added out-of-band as metadata to TPFs.
We extended this implementation with three new features.
This implementation is available on [GitHub](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf-2){:.mandatory}.

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
