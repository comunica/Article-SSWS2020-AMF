## Problem Statement
{:#problem-statement}

[Certain effects of using AMF metadata to improve query performance in the context of TPF were previously investigated](cite:cites amf2015).
The authors mainly focused on comparing two different AMF implementations with each other,
and their effects on query execution time.
This work has introduced a number of new follow-up questions,
and offers several points for improvement.
We list these as research questions for our work:

1. {:#question-precompute}
    **What query execution speedup do _pre-computed AMFs_ provide?**
    <br />
    As the authors of the earlier work on AMF suggest that pre-computation and caching of AMFs
    can reduce server delays and improve overall query evaluation,
    we will investigate the impact of pre-computing AMFs.
2. {:#question-precompute}
    **Can query evaluation be improved by _combining AMFs_ client-side?**
    <br />
    Ealier work focused on using AMF metadata to test the membership of fully materialized triples,
    while there is potential for exploiting this for other types of patterns in the query as well,
    e.g., by combining multiple AMFs.
3. {:#question-dynamic-restriction}
    **To what extent can TPF server load be reduced by _dynamically restricting_ AMF generation?**
    <br />
    Earlier work introduced AMF as a feature that was always enabled.
    However, some specific AMFs may be too expensive for servers to calculate in bursts.
    As such, it may be beneficial to _dynamically enable_ AMFs only under specific circumstances,
    e.g., for certain queries.
4. {:#question-bandwidth}
    **What impact does the HTTP bandwidth have on client-side performance with AMFs?**
    <br />
    Experiments in earlier work on AMF were based on limited HTTP bandwidth to a realistic 1Mbps.
    However, there is still an open question as to what extent different rates have an impact on the importance of AMF.
5. {:#question-inband}
    **Can query throughput be improved by adding AMF metadata _in-band_ with the TPF HTTP responses?**
    <br />
    In previous work, AMF metadata was hidden behind a link that should be followed by the client to retrieve it,
    which requires an additional HTTP request.
    This opens the question as to whether including AMF metadata directly _in-band_
    with the TPF HTTP responses could improve query performance.
6. {:#question-probabilities}
    **Which AMF _false-positive probabilities_ achieve the best client-side query performance?**
    <br />
    Based on the results the previous authors have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities do not have a significant effect on query performance.

hypotheses
{:.todo}