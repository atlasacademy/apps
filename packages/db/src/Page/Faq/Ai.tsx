import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import ai_graph_94035321 from "../../Assets/FaqPage/ai_graph_94035321.png"
import ai_shibata from "../../Assets/FaqPage/ai_shibata.png";
import wodime_thumbnail from "../../Assets/FaqPage/wodime_thumbnail.jpg";
import ai_basic_example from "../../Assets/FaqPage/ai_basic_example.png";

const warFaq = (region: Region) => {
    const artificialIntelligence = (
        <>
            A core component of battles in FGO is Artificial Intelligence (AI). There are two types, Svt and Field AIs. They control events ranging from debuffs at the start
            of a quest or enemies using a skill with ignore invincible right before using their noble phantasm.
            <br></br>
            Svt AI is an AI pertaining to a single enemy. Skills and attack listed in this Svt AI will be done by its corresponding enemy. If the quest has multiple
            enemies, each one will have its own Svt AI. When you break a bar, the follow-up enemy is not considered the same; it will have its own Svt AI.
            <br></br>
            Field AI is an AI pertaining to the "field" or "settings" of the quest. Furthermore, each quest may have multiple field AIs or none. The actions in these Field AIs
            will never be direct attacks, but they can still be damaging such as <Link to={`/${region}/skill/960876`}>Penthesilea's Intrusion</Link>.
            <br></br>
            AI is a sequence of attacks and skills that is decided by a mix of conditions being fulfilled and randomness.
            Each element of the sequence is divided into multiple attributes, these are: 
            <br></br>
            <a href="#ai-sub-id">AI Sub ID</a>, <a href="#next-ai">Next AI</a>, <a href="#act-num">Act Num</a>, <a href="#condition">Condition</a>,
            <a href="#priority-weight"> Priority|Weight</a>, <a href="act-type">Act Type</a>, <a href="act-target">Act Target</a> and <a href="act-skill">Act Skill</a>.
            <br></br>
            <br></br>
            <img alt="Ai Basic Example" id="ai-basic-example" src={ai_basic_example} width="100%"></img>
            <br></br>

            
        </>
    );

    const aiSubId = (
        <>
            The AIs are divided into parent AIs and sub (children) AIs. In the <a href="#ai-basic-example">example</a> above, <b>AI 94035323</b> is the parent AI and the two
            sub AIs are <b>2</b> and <b>1</b>. Once the sequence reaches the parent AI, it will then need to decide which sub AI to go to. This process will be delved into
            later. Some Parent AIs may contain one or few sub AIs and reaching the sub AI will be fairly straightforward. On the other hand, some parent AIs have a
            lot of sub AIs and the process to finding the next child AI is more complex.
        </>
    );

    const nextAi = (
        <>
            Once the action in the sub AI has been completed, it will go to the next parent AI. This next AI can be found in <b>Next AI</b>. In some cases, the <b>Next Ai </b>
            section will be empty, this means the next parent AI is its own parent. The process will then continue until
            the enemy runs out of actions or is out of target.
        </>
    );
    
    const graph = (
        <>
            The artificial intelligence, or the sequence of attacks and skills, can be represented by a graph like at the top of ai pages. For example,
            <Link to={`/${region}/ai/svt/94035321`}> Kama's AI from Ooku</Link>.
            <img alt="Ai Graph 94035321" src={ai_graph_94035321} width="100%"></img>
            <br></br><br></br>
            The graph is made out of nodes (rectangles with numbers in them) and edges (the lines connecting them). The nodes with bold text represent the parent AIs while the
            others are their sub AIs. The parent nodes are connected to their children with full arrows. If the sub AI's <b>Next AI</b> is its own parent, it won't have an
            arrow coming out of it. Otherwise, it will have a dotted arrow pointing towards the next parent AI.
        </>
    )
    const actNum = (
        <>
            <b>Act Num</b> is an identifier to when the ai is used. For example, you have <b>Reaction Enemyturn Start</b> and <b>Reaction Enemyturn End</b>, the beginning and
            end of enemy turn. <b>Reaction Wavestart</b> is the beginning of the wave.
            <br></br>

            <b>Shift Sarvant After</b> ("Sarvant" is typed as such in the game code) is for after a
            bar breaks. There are others like <b>Reaction Before Dead</b> which have similar purposes. Notably, all of the Act Num mentioned previously do not consume enemy
            actions. However, the Act Num <b>Anytime</b> does, it's the one used for regular attack and skills. Lastly, <b>Max Np</b> is used right before the enemy uses
            its noble phantasm to use certain skills like ignore invincible.
            <br></br>
            Skill seal blocks skills being used by the enemy, but this does not extend to skills with the aforementioned Act Num such as break bar skills. However, these
            "unavoidable skills" are sometime purposefully allowed to be blocked. For example, this is the case with
            <Link to={`/${region}/quest/94048701/1`}> Raging Billows! Kakare Shibata!</Link> or <Link to={`/${region}/quest/94041306/1`}>Sweets Universe</Link>.
            <img alt="Ai Shibata" src={ai_shibata} width="100%"></img>
        </>
    );
    const condition = (
        <>
            Which sub AI is chosen will depend on different factors, but a major one is the <b>Condition</b>.
            This is a prerequisite factor that needs to be true in order for the sub ai to be eligible. A common example of conditions can be seen with defensive skills
            such as evade or guts which typically require that the enemy be under a certain HP threshold to be used. While there are many different possible conditions,
            most are self explanatory and the same ones reoccur often. A few examples:
            <br></br>
            <b>None</b> means that there is no prerequisite condition.
            <br></br>
            <b>HP ≤ x</b> means the enemy hp has to be a certain hp threshold.
            <br></br>
            <b>Turn: [x]</b> means the turn has to be x.
            <br></br>
            <b>Self has [x] buffs</b> means the enemy needs to have certain buff active.

        </>
    );
    const priorityWeight = (
        <>
            This represents the order in which the sub AIs are considered and the weight if there are multiple sub AIs in a given priority bracket.
            All of the sub AIs are sorted based on their priority from high to low. Let's take these priorities: <b>100, 50, 50, 50, 1</b>. The sub AI with the highest
            priority is 100 and is alone in its bracket. If its condition is reached, it will always be executed. Next are the three sub AIs with a priority of 50.
            First, all of these sub Ais' conditions will be checked. If none succeed, it will go to the remaining sub ai. If more than one succeed, their weight will
            be used. The weight of each viable ai is added up into a sum–if they have a weight of 30, 50 and 60 respectively, the odds of each one happening would be
            30/140, 50/140 and 60/140. 
        </>
    );

    const actType = (
        <>
            This is the type of the sub ai. This type dictates what the ai actually does.
            <br></br>
            <b>None</b>: The ai does nothing, a placeholder of some sort.
            <br></br>
            <b>Random</b>: The ai will use a random skill or a random attack.
            <br></br>
            <b>Attack</b>: The ai will use a random attack.
            <br></br>
            <b>Random skill</b>: The ai will use a random skill.
            <br></br>
            <b><i>Skill x</i></b>: The ai will use the predetermined skill.
            <br></br>
            <b>Noble Phantasm</b>: The ai will use its noble phantasm. <b>Attack</b> will also trigger the noble phantasm.
            <br></br>
            <b>Change Thinking</b>: The ai does nothing and will go to another parent ai.
            <br></br>
            <b>Attack Critical</b>: The ai will use a critical card.
            <br></br>
            <b>Skill Id</b>: The ai will use a skill set in <b>Act Skill</b>
            <br></br>
            <b>Battle End</b>
            <br></br>
            <b><i>Attack x</i></b>: The ai will attack with either quick/buster/arts.
            <br></br>
            <b><i>Attack x Critical</i></b>: The ai will attack with either quick/buster/arts and will crit.
            <br></br>
            <b>Skill Id Checkbuff</b>: Behaves the same as <b>Skill Id</b>.
        </>
    );

    const actTarget = (
        <>
            This is the target of the sub ai. The target can be random or selected based on traits, buffs, etc.
            <br></br>
            <b>None</b>: Targets no one.
            <br></br>
            <b>Random</b>: Targets a random enemy.
            <br></br>
            <b>Hp ≤ x</b>: Targets a random enemy with certain hp threshold.
            <br></br>
            <b>Np Turn Lower</b>: Targets a random ally with lowest np bar.
            <br></br>
            <b>Np Gauge Higher</b>: Targets a random enemy with highest np gauge.
            <br></br>
            <b>Revenge</b>: Targets enemy who attacked self.
            <br></br>
            <b>Individuality Active</b>: Targets a random enemy with given trait.
            <br></br>
            <b>Buff Active</b>: Targets a random enemy with given buff.
            <br></br>
            <b>Front</b>: Targets front enemy.
            <br></br>
            <b>Center</b>: Targets center enemy.
            <br></br>
            <b>Back</b>: Targets back enemy.
            <br></br><br></br>
            An interesting case study of ai targeting is Kirschtaria Wodime from <Link to={`/${region}/quest/3000515/3`}>Atlantis 11-3</Link> demonstrated in this
            <a href="https://www.youtube.com/watch?v=yIHW-iOGbQ0"> video</a>. 
            <img alt="Wodime Thumbnail" src={wodime_thumbnail} width="50%"></img>
            <br></br>
            Upon breaking his fourth bar, Wodime is set to fill his np bar and is meant to use his noble phantasm to kill your entire party. Even if his noble
            phantasm ends up affecting everyone, it needs a starting target. Since the frontline is gone, he is unable to target anyone and the next turn ensues.
        </>
    );

    const actSkill = (
        <>
            This is the skill that the ai is going to use. This is a skill outside of the typical skill 1, 2 and 3. The field is empty if no skill is used.
        </>
    );

    return {
        id: "svt-field-ai",
        title: "Svt and Field Ai",
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
                id: "next-ai",
                title: "Next AI",
                content: nextAi,
            },
            {
                id: "graph",
                title: "AI Graph",
                content: graph,
            },
            {
                id: "act-num",
                title: "Act Num",
                content: actNum,
            },
            {
                id: "condition",
                title: "Condition",
                content: condition,
            },
            {
                id: "priority-weight",
                title: "Priority|Weight",
                content: priorityWeight,
            },
            {
                id: "act-type",
                title: "Act Type",
                content: actType,
            },
            {
                id: "act-target",
                title: "Act Target",
                content: actTarget,
            },
            {
                id: "act-skill",
                title: "Act Skill",
                content: actSkill,
            },
        ],
    };
};

export default warFaq;
