## Introduction
{:#introduction}

In the past years there has been a rise in popularity for non-SPARQL solutions to publish linked data.
One of the more prominent new interfaces is the [Triple Pattern Fragments (TPF) interface](cite:cites ldf).
This data access interface is situated somewhere between data dumps and SPARQL interfaces in complexity.
Many extensions and variants have been developed already, such as [versioning](cite:cites vtpf)
or new [query algorithms](cite:cites tpfoptimization).

Many of these variants work by adding additional metadata to either the server requests or responses.
These can provide more fine-grained details than can seen by just looking at the data returned.
Additionally, adding extra metadata doesn't break existing solutions:
older solutions will just ignore the additional metadata
and still do their work based on the rest that was provided.

One of these variants was designed by Vander Sande et al.
They tested the effect of generating [Approximate Membership Filters (AMFs)](cite:cites amf2015) 
for certain triple patterns and returning that as metadata in the TPF response.
In this paper we are going to research how the ideas presented in that paper
can be extended and made more applicable to more general cases.

For this we made use of the [Comunica framework](cite:cites comunica),
which is a modular meta query engine.
Due to its modular nature it is perfect for easily comparing the effects of adding and removing multiple features:
those specific modules simply have to be enabled or disabled when running the corresponding tests.
This makes it much easier for us to do extensive evaluations as can be seen in [](#evaluation).
Additionally, Comunica already supports full TPF support out of the box,
meaning our AMF additions could be added as separate modules to the already existing framework.

We also developed several tools helping in the evaluation automation.
Since a Comunica deployment is fully defined by its configuration file,
we made a system that generates those files for a required test setup
and automatically run tests over the corresponding Comunica implementation.
This allows us to be quite flexible and extensive in our evaluations.

In the next section we cover the related work pertaining to this paper.
After that, we go over the problem statement in [](#problem-statement)
followed by our suggested solution in [](#solution).
Our actual implementation is described in [](#implementation),
together with all our evaluations in [](#evaluation).
We finish with our conclusions in [](#conclusions).