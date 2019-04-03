## Problem Statement
{:#problem-statement}

With the introduction of the AMF interface feature 
that can be used in conjunction with TPF,
[Vander Sande et al.](cite:cites amf2015) introduced a number of follow-up questions.
In our work, we aim to answer some of these questions,
and mitigate the drawback of increased query execution times.
<span class="remark" data-author="RV">This makes an excellent introduction</span>

We list these as research questions, and defined hypotheses for each of them:

Move granular hypotheses to evaluation section, and just keep the RQs here.
{:.todo}

1. {:#question-combine}
    **Can query evaluation be improved by _combining AMFs_ client-side?**
    <span class="comment" data-author="RV">For what definition of <q>improved</q>? Make clear by rephrasing the question to include the answer.</span>
    <br />
    Earlier work focused on using AMF metadata to test the membership of fully materialized triples,
    while there is potential for exploiting this for other types of patterns in the query as well,
    e.g., by combining multiple AMFs.
    <span class="comment" data-author="RV">Say that in the question then 😁 <q>Does the combination of multiple 1-variable AMFs improve query performance (or more specific) on larger BGPs?</q></span>
    <br />
    **Hypotheses:**
    1. {:#hypo-combine-1} By combining AMFs client-side at BGP-level, query execution time is lower compared to plain TPF.
    <span class="comment" data-author="RV">Combining?</span>
    2. {:#hypo-combine-2} By combining AMFs client-side at BGP-level, query execution time is lower compared to using AMFs at triple-level.
    3. {:#hypo-combine-3} Using AMFs at both BGP _and_ triple-level does not reduce query execution time compared to only using AMFs at BGP-level.
2. {:#question-cache}
    **Does caching of HTTP requests and AMFs speed up query execution?**
    <span class="comment" data-author="RV"><q>To what extent</q>?</span>
    <br />
    As the authors of the earlier work on AMF suggest that caching of AMFs
    can reduce server delays and improve overall query evaluation,
    we will investigate the impact of caching AMFs and all HTTP requests in general.
    <br />
    **Hypotheses:**
    1. {:#hypo-cache-1} Caching HTTP requests reduces query evaluation times more than caching only AMFs.
    <span class="comment" data-author="RV"><q>responses</q>? but hard for people to understand the difference at this point</span>
    2. {:#hypo-cache-2} Caching AMFs server-side when an HTTP cache is active has no effect on query evaluation times.
    3. {:#hypo-cache-3} Without HTTP caching, AMF-aware query evaluation is slower than non-AMF query evaluation.
    4. {:#hypo-cache-4} With HTTP caching, AMF-aware query evaluation is faster than non-AMF query evaluation.
    5. {:#hypo-cache-5} Query evaluation with a cold cache is significantly slower than query evaluation with a warm cache.
    <span class="comment" data-author="RV">make falsifiable</span>
    6. {:#hypo-cache-6} With a warm cache, Bloom filters achieve lower query evaluation times compared to GCS.
3. {:#question-dynamic-restriction}
    **How do _different AMF generation thresholds_ impact server load and query evaluation times?**
    <span class="comment" data-author="RV">suggestion: <q>Does selectively enabling/disabling AMF positively impact server load and query evaluation times?</q></span>
    <br />
    <span class="comment" data-author="RT">Pending deletion</span>
    <span class="comment" data-author="RV">any specific reason? results not sufficiently interesting? I like the question</span>
    Earlier work introduced AMF as a feature that was always enabled.
    However, some specific AMFs may be too expensive for servers to calculate on the fly.
    As such, it may be beneficial to only enable AMF for queries
    that have a result count lower than a certain threshold.
    <br />
    **Hypotheses:**
    1. {:#hypo-dynamic-restriction-1} Lower thresholds slow down query execution with cached AMFs.
    2. {:#hypo-dynamic-restriction-2} Lower thresholds reduce server load without cached AMFs.
    3. {:#hypo-dynamic-restriction-3} Lower thresholds do not impact server load with cached AMFs.
    <span class="comment" data-author="RV">rephrase the above to put <q>with…</q> first, easier to parse?</span>
4. {:#question-bandwidth}
    **How does network bandwidth impact client-side performance with AMFs?**
    <br />
    Experiments in earlier work on AMF were based on limited HTTP bandwidth to a realistic 1Mbps.
    <span class="comment" data-author="RV">hard to parse previous sentence</span>
    However, there is still an open question as to what extent different rates have an impact on the importance of AMF.
    <br />
    **Hypotheses:**
    1. {:#hypo-bandwidth-1} HTTP bandwidth has a higher impact on non-AMF usage than triple-level AMF usage.
    2. {:#hypo-bandwidth-2} HTTP bandwidth has a higher impact on triple-level AMF usage than BGP-level AMF usage.
5. {:#question-inband}
    **How is query throughput improved by adding AMF metadata _out-of-band_ of TPF HTTP responses?**
    <br />
    <span class="comment" data-author="RT">Pending deletion</span>
    <span class="comment" data-author="RV">not important/necessary anymore for reduction in time?</span>
    In previous work, AMF metadata was always included in-band with the TPF response,
    which increased the size of these responses.
    This opens the question as to whether moving AMF metadata _out-of-band_
    behind a link that clients should follow would improve query performance.
    <br />
    **Hypotheses:**
    1. {:#hypo-inband-1} Out-of-band AMF metadata speeds up client-side query evaluation.
    2. {:#hypo-inband-2} Out-of-band AMF metadata increases the total amount of HTTP requests.
6. {:#question-probabilities}
    **Which AMF _false-positive probabilities_ achieve the best client-side query performance?**
    <br />
    <span class="comment" data-author="RV">Rather something about <q>how low can we go</q>?</span>
    <span class="comment" data-author="RT">Pending deletion</span>
    Based on the results the previous authors have suggested that additional experimentation is needed with regards
    to lower _AMF false-positive probabilities_, as higher probabilities do not have a significant effect on query performance.
    <br />
    **Hypotheses:**
    1. {:#hypo-probabilities-1} Lower probabilities lead to faster client-side query execution.
    <span class="comment" data-author="RV">…up to a certain point? what is the tipping point?</span>

To come up with an answer to these research questions,
their hypotheses will be tested in [](#evaluation) based on our experimental results.
