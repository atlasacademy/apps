import { Link } from "react-router";

import { Region } from "@atlasacademy/api-connector";

import ai_basic_example from "../../Assets/FaqPage/ai_basic_example.png";
import ai_graph_105220 from "../../Assets/FaqPage/ai_graph_105220.png";
import ai_shibata from "../../Assets/FaqPage/ai_shibata.png";

const warFaq = (region: Region) => {
    const artificialIntelligence = (
        <>
            <p>
                A core component of battles in FGO is Artificial Intelligence (AI). There are two types, Svt and Field
                AIs. They control events ranging from debuffs at the start of a quest to enemies using a skill with
                ignore invincible right before using their noble phantasm.
            </p>
            <p>
                Svt AI is an AI pertaining to a single enemy. Skills and attack listed in this Svt AI will be done by
                its corresponding enemy. If the quest has multiple enemies, each one will have its own Svt AI. When you
                break a bar, the follow-up enemy is not considered the same, it will have its own Svt AI.
            </p>
            <p>
                Field AI is an AI pertaining to the “field” or “settings” of the quest. Furthermore, each quest may have
                multiple field AIs or none. Field AIs are usually used to apply buffs to player servants or enemies. The
                actions in these Field AIs will never be direct attacks, but they can still be damaging such as{" "}
                <Link to={`/${region}/skill/960876`}>Penthesilea's Intrusion</Link>.<br></br>
            </p>
            <p>Below is an example of a typical AI with all the attributes listed.</p>
            <img alt="Ai Basic Example" id="ai-basic-example" src={ai_basic_example} width="100%" />
        </>
    );

    const aiSubId = (
        <>
            <p>
                The AIs are divided into parent AIs and sub (children) AIs. In the{" "}
                <a href="#ai-basic-example">example</a> above, <b>AI 94035323</b> is the parent AI and the two sub AIs
                are <b>2</b> and <b>1</b>. If there are multiple sub AIs, one of them will be picked to be executed.
            </p>
            <p>
                First, <a href="#ai-condition">conditions</a> are checked and only sub AIs with satisfied conditions are
                legible to be executed. Then, <a href="#ai-priority-weight">priorities and weights</a> are checked. The
                sub AIs with the highest priority and satisifed conditions will be executed. If there are multiple
                eligible sub AIs with the same priority, one will be picked randomly using the weights specified. After
                one sub AI is selected, the action listed in the sub AI will be executed. Details about the selection
                criteria and action taken will be described in later sections.
            </p>
            <p>
                After the AI and sub AI are processed, if <a href="#ai-next">Next AI</a> is specified, it will move on
                to the next parent AI. If the next parent AI also has multiple sub AIs, the selection procedure will
                occur again with the new sub AIs. If Next AI is not specified, the same parent AI will be executed again
                and the selection procedure is run again.
            </p>
        </>
    );

    const nextAi = (
        <>
            Once the action in the sub AI has been completed, it will go to the next parent AI which can be found here.
            In some cases, the Next AI section can be empty, this means the parent AI will stay unchanged. The process
            will then continue until the enemy runs out of actions or is out of target.
        </>
    );

    const graph = (
        <>
            <p>
                The artificial intelligence, or the sequence of attacks and skills, can be represented by a graph like
                at the top of AI pages. The graph is made out of nodes (rectangles with numbers in them) and edges (the
                lines connecting them). The nodes with bold text represent the parent AIs while the others are their sub
                AIs. The parent nodes are connected to their children with solid arrows. If the sub AI's Next AI is not
                specified, it won't have an arrow coming out of it. Otherwise, it will have a dotted arrow pointing
                towards the next parent AI.{" "}
            </p>
            <p>
                For example,{" "}
                <Link to={`/${region}/ai/svt/105220?skillId1=960167&skillId2=960168&skillId3=960169`}>
                    Demon God Halphas's AI from the Fifth Singularity
                </Link>
                .
                <img alt="Ai Graph Demon God Halphas" src={ai_graph_105220} width="100%" />
            </p>
            <ul>
                <li>
                    The first AI <code>105220</code> has 4 sub AIs. One of the 4 sub AIs will be chosen and executed.{" "}
                    <ul>
                        <li>
                            If one of <code>105220-1</code>, <code>105220-2</code> and <code>105220-3</code> is chosen
                            and processed, the game will then repeat the process and pick one of the <code>105220</code>{" "}
                            sub AIs again since these three sub AIs do not have Next AI specified.
                        </li>
                        <li>
                            If the <code>105220-4</code> sub AI is selected and processed, the game will move on to the
                            next parent AI <code>105221</code>.
                        </li>
                    </ul>
                </li>
                <li>
                    The same process will then repeat at <code>105221</code> with the game chosing one of{" "}
                    <code>105221-1</code>, <code>105221-2</code>, <code>105221-3</code> and <code>105221-4</code> to
                    execute. Again, the game will stay at <code>105221</code> if one of the first three sub AIs is
                    chosen or move to <code>105222</code> if <code>105221-4</code> is chosen.
                </li>
                <li>
                    The same process will happen again in <code>105222</code>.
                </li>
                <li>
                    If the game arrives at parent AI <code>105223</code>, since all <code>105223</code>'s sub AI don't
                    have Next AI, Demon God Halphas will only execute actions specified in <code>105223</code> from now
                    on.
                </li>
            </ul>
        </>
    );

    const actNum = (
        <>
            Act Num is an identifier to when the AI is used. For example, sub AIs with Act Num <code>Anytime</code> can
            happen anytime. <code>Anytime</code> is usually used for regular attacks and skills. Below is some other
            common Act Nums:
            <ul className="my-2">
                <li>
                    <code>Reaction Enemyturn Start:</code> The beginning of enemy turn.
                </li>
                <li>
                    <code>Reaction Enemyturn End:</code> The end of enemy turn.
                </li>
                <li>
                    <code>Reaction Wavestart:</code> The beginning of the wave.
                </li>
                <li>
                    <code>Shift Sarvant After:</code> After a bar breaks ("Sarvant" is a typo in the game code).
                </li>
                <li>
                    <code>Max Np:</code> Right before the enemy uses its noble phantasm to use certain skills like
                    ignore invincible.
                </li>
            </ul>
            <p>
                While sub AIs with Act Num <code>Anytime</code> do consume one enemy action, all of the Act Num
                mentioned in the list above do not cosume one when executed.
            </p>
            <p>
                Moreover, skill seal cannot block skills executed by aforementioned Act Num such as break bar skills. If
                the sub AI has act type <code>Skill Id</code>, the skill will still be executed even if the actor was
                skill sealed. However, these "unavoidable skills" are sometime purposefully allowed to be blocked using
                other sub AIs. For example, this is the case with
                <Link to={`/${region}/quest/94048701/1`}> Raging Billows! Kakare Shibata!</Link> or{" "}
                <Link to={`/${region}/quest/94041306/1`}>Sweets Universe</Link>.
            </p>
            <img alt="Ai Shibata" src={ai_shibata} width="100%" className="mb-2" />
            <p>
                Since Sub ID 2, 3 and 4 have higher priorities, if Shibata is petrified or skill sealed, he won't use
                the "…Advance!" skill.
            </p>
        </>
    );

    const condition = (
        <>
            Condition is a prerequisite factor that needs to be true in order for the sub AI to be eligible. A common
            example of conditions can be seen with defensive skills such as evade or guts which typically require that
            the enemy be under a certain HP threshold to be used. While there are many different possible conditions,
            most are self explanatory and the same ones reoccur often. Here are some common conditions:
            <ul className="mt-1">
                <li>
                    <code>None:</code> There is no prerequisite condition.
                </li>
                <li>
                    <code>HP &le; &#123;𝑥&#125;:</code> The enemy HP has to be less than a certain HP threshold.
                </li>
                <li>
                    <code>Turn: &#123;𝑥&#125;:</code> The turn has to be 𝑥.
                </li>
                <li>
                    <code>Self has &#123;𝑥&#125; buffs:</code> The enemy needs to have certain buff active.
                </li>
            </ul>
        </>
    );

    const priorityWeight = (
        <>
            <p>
                This represents the order in which the sub AIs are considered and the weights if there are multiple sub
                AIs with the same priority. All of the sub AIs are sorted based on their priority from high to low.
            </p>
            <p>
                For example, considering the sub AIs with the following priorities and weights:{" "}
                <code>100|100, 50|60, 50|40, 50|30, 1|100</code>.
            </p>
            <ul className="mt-1">
                <li>
                    If the first sub AI's condition is satisfied, this sub AI will be executed since it has the highest
                    priority of 100.
                </li>
                <li>
                    If the first sub AI's condition is not satisfied, the sub AIs with the second highest priority are
                    considered: <code>50|60, 50|40, 50|30</code>.
                </li>
                <ul>
                    <li>
                        If the conditions of all three sub AIs are satisfied, one will be selected randomly with the
                        odds being 60/130, 40/130 and 30/130 respectively.
                    </li>
                    <li>
                        If only the last two sub AIs have their conditions satisfied, one will be selected randomly from
                        the two with the odds being 40/70 and 30/70 respectively.
                    </li>
                </ul>
                <li>
                    If none of the 100 and 50 priority sub AIs' conditions are satisfied, the <code>1|100</code> sub AI
                    condition is checked and will be executed if possible.
                </li>
            </ul>
        </>
    );

    const actType = (
        <>
            This is the type of the sub AI. This type dictates what the AI actually does.
            <ul className="mt-1">
                <li>
                    <code>None:</code> The AI does nothing, a placeholder of some sort.
                </li>
                <li>
                    <code>Random:</code> The AI will use a random attack, its noble phantasm if available or a random
                    skill among the entity's active skills.
                </li>
                <li>
                    <code>Attack:</code> The AI will use a random attack or its noble phantasm if available.
                </li>
                <li>
                    <code>Random skill:</code> The AI will use a random skill among the entity's active skills.
                </li>
                <li>
                    <code>Skill &#123;1, 2, 3&#125;:</code> The AI will use the first, second or third skill of the
                    entity's active skills.
                </li>
                <li>
                    <code>Noble Phantasm:</code> The AI will use its noble phantasm.
                </li>
                <li>
                    <code>Change Thinking:</code> The AI does nothing and will go to another parent AI.
                </li>
                <li>
                    <code>Attack Critical:</code> The AI will do a critical attack.
                </li>
                <li>
                    <code>Skill Id:</code> The AI will use the skill specified in <a href="#ai-act-skill">Act Skill</a>.
                </li>
                <li>
                    <code>Battle End</code>
                </li>
                <li>
                    <code>Attack &#123;1, 2, 3&#125;:</code> The AI will attack with either quick, buster or arts.
                </li>
                <li>
                    <code>Attack &#123;1, 2, 3&#125; Critical:</code> The AI will attack with either quick, buster, arts
                    and will crit.
                </li>
                <li>
                    <code>Skill Id Checkbuff:</code> Behaves the same as <code>Skill Id</code>.
                </li>
            </ul>
        </>
    );

    const actTarget = (
        <>
            This is the target of the sub AI. The target can be random or selected based on traits, buffs, etc.
            <ul className="my-1">
                <li>
                    <code>None:</code> Targets no one.
                </li>
                <li>
                    <code>Random:</code> Targets a random enemy.
                </li>
                <li>
                    <code>Hp &le; &#123;𝑥&#125;:</code> Targets a random enemy that is less than a certain HP threshold.
                </li>
                <li>
                    <code>Np Turn Lower:</code> Targets a random ally with lowest NP bar.
                </li>
                <li>
                    <code>Np Gauge Higher:</code> Targets a random enemy with highest NP gauge.
                </li>
                <li>
                    <code>Revenge:</code> Targets enemy who attacked self.
                </li>
                <li>
                    <code>Individuality Active:</code> Targets a random enemy with given trait.
                </li>
                <li>
                    <code>Buff Active:</code> Targets a random enemy with given buff.
                </li>
                <li>
                    <code>Front:</code> Targets front enemy.
                </li>
                <li>
                    <code>Center:</code> Targets center enemy.
                </li>
                <li>
                    <code>Back:</code> Targets back enemy.
                </li>
            </ul>
            An interesting case study of AI targeting is Kirschtaria Wodime from{" "}
            <Link to={`/${region}/quest/3000515/3`}>Atlantis 11-3</Link> demonstrated in the video{" "}
            <a href="https://youtu.be/yIHW-iOGbQ0" rel="nofollow noreferrer" lang="ja-JP">
                アトランティス キリシュタリア撃破 令呪13画使用
            </a>{" "}
            by <span lang="ja-JP">ゆきおじ</span>.{" "}
            {/* <div style={{ maxWidth: "30em", margin: "1em auto" }}>
                <div
                    style={{
                        paddingTop: "56.25%",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <iframe
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                        src="https://www.youtube-nocookie.com/embed/yIHW-iOGbQ0"
                        title="YouTube video player"
                        allow="clipboard-write; picture-in-picture"
                    ></iframe>
                </div>
            </div> */}
            Upon breaking his fourth bar, Wodime is set to fill his NP bar and is meant to use his noble phantasm to
            kill your entire party. Even if his noble phantasm ends up affecting everyone, it needs a starting target.
            Since the frontline is gone, he is unable to target anyone and the next turn ensues.
        </>
    );

    const actSkill = (
        <>
            If AI act type is of <code>Skill Id</code> or <code>Skill Id Checkbuff</code>, this field will have the
            skill that will be used.
        </>
    );

    return {
        id: "svt-field-ai",
        title: "Svt and Field AI",
        subSections: [
            {
                id: "artificial-intelligence",
                title: "Artificial Intelligence",
                content: artificialIntelligence,
            },
            {
                id: "ai-sub-id",
                title: "AI Sub ID",
                content: aiSubId,
            },
            {
                id: "ai-graph",
                title: "AI Graph",
                content: graph,
            },
            {
                id: "ai-act-num",
                title: "Act Num",
                content: actNum,
            },
            {
                id: "ai-condition",
                title: "Condition",
                content: condition,
            },
            {
                id: "ai-priority-weight",
                title: "Priority|Weight",
                content: priorityWeight,
            },
            {
                id: "ai-act-type",
                title: "Act Type",
                content: actType,
            },
            {
                id: "ai-act-target",
                title: "Act Target",
                content: actTarget,
            },
            {
                id: "ai-act-skill",
                title: "Act Skill",
                content: actSkill,
            },
            {
                id: "ai-next",
                title: "Next AI",
                content: nextAi,
            },
        ],
    };
};

export default warFaq;
