## Implementation
{:#implementation}

There is too much overlap with the previous section, should merge or re-think how to handle probably.
{:.todo}

To implement our solution described in [](#solution) we made use of the [Comunica framework](cite:cites comunica),
which already fully supports the TPF algorithm.
Its modular structure makes it ideal for us to add on to the existing implementation,
without having to change the existing code base.
Adding our features to the Comunica ecosystem caused us to create [8 new modules](https://github.com/comunica/comunica-feature-amf){:.mandatory}
to integrate our new features with the framework.

Since there is no modular infrastructure on the server side,
we created a [new branch](https://github.com/LinkedDataFragments/Server.js/tree/feature-handlers-amf-2){:.mandatory} in the repository that supports returning the required metadata.

Anonymize source code links
{:.todo}

### Integration with Comunica

Put Comunica description summary completely in related work and reference that?
{:.todo}

For a full overview of how Comunica works,
we refer to the resource [paper](cite:cites comunica).
The main idea is that an instance consists of many actors
that all fulfill a specific task.
Actors don't communicate directly with each other:
if input is required from an actor with a different function
this gets done by a mediator in-between.
Such a mediator has a collection of actors implementing the same functionality (a bus),
and then picks one to execute the given request.

For our Comunica implementation,
we added components on several levels:

 * An actor to extract AMF metadata
 * Two actors to apply Bloom and GCS membership filters to RDF data
 * A bus module to group membership filter actors
 * An actor implementing the [original AMF algorithm](cite:cites amf2015)
 * Two new BGP actors, to apply two different implementations of our AMF algorithm
 * A new SPARQL actor with a new default config that also includes these AMF actors

All these actors can be independently to an existing Comunica framework,
depending on the needs of the user.
For the evaluations in [](#evaluation),
we created several config files,
enabling and disabling some of these features as required for the given test.
They could also easily be integrated into the framework,
since there already were actors to extract metadata,
or actors to handle BGPs,
these actors were simply added next to the existing ones or replaced them.

#### BGP actor

Pictures could probably help here.
{:.todo}

Since the biggest change compared to the previous work is the new BGP algorithm,
we will delve deeper into the implementation of that actor.
[](#tpf) contains a simplified view at how the current framework handles BGP resolution in Comunica.
Since we want to make use of the modular nature of Comunica,
and not edit the existing code,
we can't actually add our code in the existing actor.
To handle this,
we made a new BGP actor, BGP-AMF, that gets called before the original BGP actor receives the patterns.
[](#bgp-amf) shows a simplified version of what this actor does.

<figure id="bgp-amf" class="listing">
````/code/bgp-amf.js````
<figcaption markdown="block">
New BGP-AMF actor.
</figcaption>
</figure>

The `parentAMF` variable seen there is the filter metadata of the pattern in the previous iteration.
This means that if the pattern was bound to a certain value in this iteration,
it still has the filter for the variable that was in that position.
In case the metadata is sent out-of-band,
the actual filter would only be downloaded at this point due to lazy programming.

For the sake of brevity we will not show a code sample of the second implementation.
But the idea with that actor is to first group all filters based on the variable they are applicable to.
In case of out-of-band data, this actor would prefetch the metadata simultaneously,
helping performance.
In case the heuristic mentioned before was enabled, both these actors would also be responsible for making use of it.


### Server metadata

Is there added value in describing what the metadata looks like here?
{:.todo}
