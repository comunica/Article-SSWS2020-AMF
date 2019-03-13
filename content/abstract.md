## Abstract
<!-- Context      -->
The usage of non-SPARQL data interfaces has been increasing,
with Triple Pattern Fragments (TPF) being one of the more popular choices.
Several variants of TPF have already been developed.
<!-- Need         -->
Many of these have been designed in an attempt to improve the performance
when executing SPARQL queries over these interfaces.
<!-- Task         -->
One of these variants uses Approximate Membership Filters (AMFs) to pre-filter potential results.
This reduced the amount of requests sent to the server when solving queries.
<!-- Object       -->
In this paper we researched how this AMF metadata can further be exploited to improve querying TPF interfaces.
These additions were then tested extensively using the Comunica framework.
<!-- Findings     -->
We discovered that introducing AMFs earlier in the query process
can drastically reduce the amount of necessary requests and thereby improve the query execution times.
Comunica greatly aided in the extensive evaluation due to its modular nature.
<!-- Conclusion   -->
These results show how this extra metadata can help with query execution while not negatively impacting the server.
<!-- Perspectives -->
We did not yet cover all possibilities of AMFs with TPF.
Potential future research includes investigating the impact on federated queries
and discovering which queries are optimally suited for these additions.
