## Problem Statement
{:#problem-statement}

With the introduction of the AMF interface feature 
that can be used in conjunction with TPF,
[Vander Sande et al.](cite:cites amf2015) introduced a number of follow-up questions.
In our work, we aim to answer some of these questions,
and mitigate the drawback of increased query execution times.
We list these as research questions:

1. {:#question-combine}
    **Can query execution time be lowered by combining triple pattern AMFs client-side on larger BGPs?**
    <br />
    Earlier work focused on using AMF metadata to test the membership of fully materialized triples,
    while there is potential for exploiting this for other types of patterns in the query as well.
    For instance, combining multiple AMFs at BGP-level
    by applying AMFs on triple patterns with shared variables.
2. {:#question-cache}
    **To what extend does caching of HTTP requests and AMFs speed up query execution?**
    <br />
    As the authors of the earlier work on AMF suggest that caching of AMFs
    can reduce server delays and improve overall query evaluation,
    we will investigate the impact of caching AMFs and all HTTP requests in general.
3. {:#question-dynamic-restriction}
    **Does selectively enabling AMF positively impact server load and query evaluation times?**
    <br />
    Earlier work introduced AMF as a feature that was always enabled.
    However, some specific AMFs may be too expensive for servers to calculate on the fly.
    As such, it may be beneficial to only enable AMF for queries
    that have a result count lower than a certain threshold.
4. {:#question-bandwidth}
    **How does network bandwidth impact client-side performance with AMFs?**
    <br />
    In experiments from earlier work on AMF, the HTTP bandwidth was set to a realistic 1Mbps.
    However, there is still an open question as to what extent different rates have an impact on the importance of AMF.
5. {:#question-probabilities}
    **How low can AMF false-positive probabilities become to still achieve decent client-side query performance?**
    <br />
    Based on the results the previous authors have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities did not have a significant effect on query performance.

To come up with an answer to these research questions,
we will introduce statistical hypotheses in [](#evaluation)
that will be tested based on our experimental results.
