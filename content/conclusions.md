## Conclusions
{:#conclusions}

In this article, we introduced client-side and server-side improvements
to the AMF feature for TPF.
Thanks to the newly introduced benchmarking framework, our experiments are fully and easily reprodicible.
As results have shown, our client-side algorithms significantly reduce query execution times
compared to the algorithm introduced by Vander Sande et al.
Furthermore, we have shown that AMF metadata requires limited effort from servers.

We offer implementations of these algorithms and server enhancements,
which means that it can be used by any of the 650.000+ data publishers
<span class="comment" data-author="RV">well, LODL is one publisher (and they might be closing), so wouldn't mention numbers</span>
that are exposing their data through a TPF interface,
or any client that aims to query from them.
Based on our discussion in [](#evaluation),
we offer the following guidelines for publishers that aim to use the AMF feature:

* Enable **HTTP caching** with a tool such as [NGINX](https://www.nginx.com/).
* **Pre-compute AMFs**, or at least cache, AMFs of size 10.000 or higher.
* If AMFs can be cached, prefer **Bloom filters** over GCS.
* Emit AMF metadata **out-of-band**.
* Use a false-positive **probability of 1/64**.

Even though we answered many open questions regarding AMFs,
there are a couple of new questions.
First, we need further investigatation on our heuristic for dynamically disabling the BGP-based AMF algorithm.
Second, dynamically switching between algorithms may improve diefficiency,
as the BGP-based algorithm postpones time until first result.
Finally, as approaches such as [Solid](cite:cites solid) are pushing towards a more _decentralized_ Web,
investigation of AMFs in the context of federated querying is needed,
which is not trivial, as filters of multiple sources may need to be combined.
