## Problem Statement
{:#problem-statement}

With the introduction of the AMF interface feature 
that can be used in conjunction with TPF,
[Vander Sande et al.](cite:cites amf2015) introduced a number of follow-up questions.
In our work, we aim to answer some of these questions,
and mitigate the drawback of increased query execution times.
We list these as research questions:

1. {:#question-combine}
    **Can query execution time be lowered by combining triple pattern AMFs client-side on larger Basic Graph Patterns (BGPs)?**
    <br />
    Earlier work focused on using AMF metadata from triple pattern queries
    to test the membership of fully materialized triples,
    while there is potential for exploiting this for other types of patterns in the query as well.
    For instance, combining multiple AMFs at BGP-level
    by applying AMFs on triple patterns with shared variables.
2. {:#question-cache}
    **To what extent does HTTP caching and AMFs speed up query execution?**
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
5. {:#question-probabilities}
    **How low can AMF false-positive probabilities become to still achieve decent client-side query performance?**
    <br />
    Based on their results, Vander Sande et al. have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities did not have a significant effect on query performance.

To come up with an answer to these research questions,
we will introduce statistical hypotheses in [](#evaluation)
that will be tested based on our experimental results.
