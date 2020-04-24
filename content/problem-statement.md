## Problem Statement
{:#problem-statement}

The goal of our work is to investigate how query execution over TPF interfaces can be optimized using AMFs.
We thereby build upon the work from [Vander Sande et al.](cite:cites amf2015),
where the authors allowed the number of HTTP requests to be reduced
at the cost of slower query execution.
Our goal is to mitigate this major drawback, while retaining its advantages.

Vander Sande et al. introduced a number of follow-up questions
that we use as a basis for defining our research questions.
Concretely, in order to mitigate the earlier mentioned drawbacks,
our research questions are defined as follows:

1. {:#question-combine}
    **Can query execution time be lowered by combining triple pattern AMFs client-side on larger Basic Graph Patterns (BGPs)?**
    <br />
    Earlier work focused on using AMF metadata from triple pattern queries
    to test the membership of materialized triples,
    while there is potential for exploiting this for other types of patterns in the query as well.
    For instance, combining multiple AMFs at BGP-level
    by applying AMFs on triple patterns with shared variables.
2. {:#question-cache}
    **To what extent do HTTP caching and AMFs speed up query execution?**
    <br />
    As Vander Sande et al. suggest that caching of AMFs
    reduce server delays, we investigate the impact of caching HTTP requests and/or AMFs.
3. {:#question-dynamic-restriction}
    **How does selectively enabling AMF impact server load and querying?**
    <br />
    Earlier work introduced AMF as a feature that was always enabled.
    However, some specific AMFs may be too expensive for servers to calculate on the fly.
    As such, it may be beneficial to only enable AMF for queries
    that have a result count lower than a certain threshold.
4. {:#question-bandwidth}
    **How does network bandwidth impact query performance with AMFs?**
    <br />
    In experiments by Vander Sande et al., the HTTP bandwidth was set to a realistic 1Mbps.
    However, there is still an open question as to what extent different rates have an impact on the importance of AMF.
5. {:#question-inband}
    **How is query throughput improved by adding AMF metadata in-band to TPF HTTP responses?**
    <br />
    In previous work, AMF metadata was always included out-of-band of TPF responses,
    behind a link that clients should follow.
    This opens the question as to whether moving AMF metadata _in-band_
    and increasing the size of these responses
    would improve query performance.
6. {:#question-probabilities}
    **How low can AMF false-positive probabilities become to still achieve decent client-side query performance?**
    <br />
    Based on their results, Vander Sande et al. have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities did not have a significant effect on query performance.
    Note that query correctness is never affected,
    but rather the number of requests to the server,
    since every positive match requires a request
    to verify whether it is a true or false positive.

To come up with an answer to these research questions,
we will introduce statistical hypotheses in [](#evaluation)
that will be tested based on our experimental results.
