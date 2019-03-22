## Conclusions
{:#conclusions}

In this paper we showed how there are many ways AMF metadata can be used
to increase query performances over TPF endpoints.
Depending on how the metadata is used,
it can have a definite impact on the results.
There are still choices that have to be made sometimes,
depending on factors such as the server capabilities,
expected load, query diversity, data size, and so on.

To evaluate all these different options,
we made use of the Comunica framework.
In our evaluation section we have clearly shown the added advantage
of using such a framework for testing purposed.
Without much effort, we were capable of running a diverse set of tests over many different configurations.
Whereas this would usually take quite some work to set everything up every time,
and would require multiple implementations,
here we could easily swap out different setups.

We did not cover everything that is possible with the membership filters for SPARQL queries.
There are still plenty of options that can be researched.
For one there is the heuristic to determine when it is actually profitable to download the filters.
In this paper we presented a simple heuristic 
to determine situations where the extra overhead is actually a disadvantage,
But much more work can be done in fine-tuning this.

Another avenue that has not yet been tested is how this would perform in a federated environment
and how filters of multiple sources could be combined.
A possibility would be to use the response of one source to filter results on another source,
similar to how [brTPF](cite:cites brtpf) sends extra data to a server.

If we cut stuff out of the evaluation section we can put it here as future work.
{:.todo}
