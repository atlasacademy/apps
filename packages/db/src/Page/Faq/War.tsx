import { faBook, faDragon, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import event_page_main_info from "../../Assets/FaqPage/event_page_main_info.png";
import event_page_shop_planner from "../../Assets/FaqPage/event_page_shop_planner.png";
import event_page_shop_planner_exclude from "../../Assets/FaqPage/event_page_shop_planner_exclude.png";
import quest_page_enemy from "../../Assets/FaqPage/quest_page_enemy.png";
import quest_page_main_info from "../../Assets/FaqPage/quest_page_main_info.png";
import quest_page_script_drop_data from "../../Assets/FaqPage/quest_page_script_drop_data.png";
import script_search_page from "../../Assets/FaqPage/script_search_page.png";
import war_page_free_quests from "../../Assets/FaqPage/war_page_free_quests.png";
import war_page_main_info from "../../Assets/FaqPage/war_page_main_info.png";
import war_page_main_quests from "../../Assets/FaqPage/war_page_main_quests.png";

const warFaq = (region: Region) => {
    const whatIsAWar = (
        <>
            You can think of a war as a container for the various quests in game. The{" "}
            <Link to={`/${region}/war/100`}>Fuyuki Singularity</Link>, <Link to={`/${region}/war/301`}>Lostbelt 1</Link>
            , the map for <Link to={`/${region}/war/8290`}>Battle in New York</Link>, and even the lists of{" "}
            <Link to={`/${region}/war/8290`}>Daily Quests</Link> or <Link to={`/${region}/war/1003`}>Interludes</Link>{" "}
            that you see on the main page of FGO are wars. It is important to note that wars are distinct from events,
            which have their own page on the Atlas Academy DB. While an event may have a war attached to it, such as
            GudaGuda, the event itself is not a war, nor do all events have wars. A half AP event in FGO, for example,
            does not have a war attached. See the event section for more details on events.
        </>
    );

    const warBreakDown = (
        <>
            An example war to look at is{" "}
            <Link to={`/${region}/war/100`}>Singularity F: Flame Contaminated City: Fuyuki</Link>. You'll see that the
            page is broken into several sections. The first section, as represented below, includes general information
            about the war, including:
            <ul>
                <li>
                    <b>Name</b>
                </li>
                <li>
                    <b>Age</b>: Time of the war in game, such as 2004 for Fuyuki
                </li>
                <li>
                    <b>Event</b>: The event that the war is tied to (if any)
                </li>
                <li>
                    <b>Opening Scripts</b>: story sequences that appear when first opening the war
                </li>
                <li>
                    <b>Banner</b>: the war's icon on your terminal
                </li>
                <li>
                    <b>BGM</b>: the war's main background music
                </li>
            </ul>
            You will also see buttons for the raw data of the war itself that is used to render the page, either in Nice
            or Raw format.
            <img alt="War Page Main Info" src={war_page_main_info} width="100%" />
            Beneath the war's general information you will find the main quests associated with the war, if any. Each
            quest will tell you the following information:
            <ul>
                <li>
                    <b>Section</b>: chapter in game
                </li>
                <li>
                    <b>ID</b>
                </li>
                <li>
                    <b>Name</b>
                </li>
                <li>
                    <b>Spot</b>: node, or location on a map in game
                </li>
                <li>
                    <b>Phases</b>: the different arrows or parts to a quest, such as 1-1, 1-2, 1-3 etc.
                </li>
                <li>
                    <b>Completion Reward</b> (if applicable)
                </li>
                <li>
                    <b>Scripts</b>: any story sections that the quest has
                </li>
            </ul>
            Clicking on the quest's ID or name will take you to that quest's page, and clicking on any individual phase
            will take you directly to that phase of the quest. A dragon symbol <FontAwesomeIcon icon={faDragon} /> by a
            phase indicates it has enemies; a book symbol <FontAwesomeIcon icon={faBook} /> indicates it is story only.
            <img alt="War Page Main Quests" src={war_page_main_quests} width="100%" />
            Beneath the main quests you will find, if applicable, <b>free quests</b>, <b>interludes</b>,{" "}
            <b>event quests</b>, or any other type of available quests, each sorted into its own dropdown. Within each
            dropdown, the quests are ordered within their respective nodes, then by quest ID.
            <img alt="War Page Free Quests" src={war_page_free_quests} width="100%" />
        </>
    );

    const whatIsAQuest = (
        <>
            Quests are the individual containers for dialogue or battle sequences in FGO. When you click on a map
            location within a singularity or event, the options that you have, be it the next part of the story, a free
            quest, or an interlude, are quests.
        </>
    );

    const questBreakDown = (
        <>
            An example quest to look at is <Link to={`/${region}/quest/1000001/1`}>Burning City</Link>. You'll see that
            like the war page, it is broken into several sections. The first section, as represented below, includes
            general information about the quest, including, among other things:
            <ul>
                <li>
                    <b>Type</b>: free quest, main quest, interlude etc.
                </li>
                <li>
                    <b>Cost</b>: AP or any other currency required to complete the quest
                </li>
                <li>
                    <b>Rewards</b>: First clear rewards for completing the quest (if applicable)
                </li>
                <li>
                    <b>Opening</b> and <b>Closing</b> times (in your local time)
                </li>
                <li>
                    <b>Individuality</b>: whether it is a sun field, city field, a specific event field, etc.
                </li>
            </ul>
            Many quests have multiple phases, or parts to the quest. These are seen as 1-1, 1-2, 1-3, etc. in game, with
            each piece being its own phase. For quests with multiple phases, you can navigate between them using the
            arrows or numbers in the <b>Phases</b> row.
            <img alt="Quest Page Main Info" src={quest_page_main_info} width="100%" />
            Beneath the general information, you will see a list of the scripts for the phase you are on (if any), as
            well as any pre-battle messages and drop data if available. Mouse over the{" "}
            <FontAwesomeIcon icon={faInfoCircle} /> to see a tooltip indicating how many runs the drop data is based on.
            The more runs worth of data, the more accurate it is.
            <img alt="Quest Page Script and Drop data" src={quest_page_script_drop_data} width="100%" />
            Finally, below the drop data you will see a list of stages, or battle waves, as well as the enemies within
            them if available. Please note that enemy data is not available for all quests. The enemy data includes a
            list of the drops of each particular mob if available, as well as all the general information regarding each
            enemy, including their, among other things:
            <ul>
                <li>
                    <b>Stats</b>: such as HP, NP bars, death rate, etc.
                </li>
                <li>
                    <b>Skills</b>
                </li>
                <li>
                    <b>Traits</b>
                </li>
                <li>
                    <b>AI</b>: used to determine how enemies will act in battle
                </li>
            </ul>
            You may also see a <b>Field AI</b> before the enemies. This refers to effects tied to the field itself
            rather than any individual enemy.
            <img alt="Quest Page Enemy" src={quest_page_enemy} width="100%" />
        </>
    );

    const huntingQuest = (
        <>
            Hunting and Trial quests can be found in <Link to={`/${region}/war/999`}>War 9999: Chaldea Gate</Link>.
        </>
    );

    const whatIsAnEvent = (
        <>
            As noted in the Wars section, Events and Wars, while sometimes sounding similar, are very different things.
            If one thinks of Saber Wars for an example, there are two separate components: the{" "}
            <Link to={`/${region}/war/8095`}>War</Link>, or the actual Saber Wars map with nodes and quests on it, and
            the <Link to={`/${region}/event/80008`}>Event</Link> behind it. The event is where you can find information
            like the lottery, point ladder, or shop tied to an in-game event. Note that some events may not have these,
            such as a 1/2 AP or bonus FP event.
        </>
    );

    const eventBreakDown = (
        <>
            Like the other pages, the Event page is broken down into sections. The top section provides general
            information about the event, including:
            <ul>
                <li>
                    <b>ID</b>
                </li>
                <li>
                    <b>Name</b>
                </li>
                <li>
                    <b>Wars</b>: any Wars tied to the event
                </li>
                <li>
                    <b>Status</b>: whether the event is ongoing or not
                </li>
                <li>
                    <b>Status</b> and <b>End</b> times (in your local time)
                </li>
            </ul>
            <img alt="Event Page Main Info" src={event_page_main_info} width="100%" />
            Beneath the general information will be any point ladders, shops, or lotteries if applicable. For shops in
            particular, you are able to utilize the planner to calculate the amount of event currency you will need for
            what you want. To enable the planner feature, click the green edit button on the right side of the currency
            bar, pictured below:
            <img alt="Event Page Shop Planner" src={event_page_shop_planner} width="100%" />
            Once you have enabled planner mode, you have several options. You can utilize the <b>Quick Toggles</b> in
            order to instantly select or deselect all items, and you can also filter out commonly excluded items from
            the calculated totals, such as gems, monuments, or pieces. In addition to the Quick Toggles, you can also
            individually select items that you want. The two rightmost columns for each item are <b>Limit</b> and
            <b>Target</b>. Limit refers to the maximum amount of an item that can be purchased, while Target allows you
            to indicate how many of that item you wish to purchase. For each item you set with Target, the total cost of
            that item is added to the cost bar above the shop. In the image below, you will see that two "Purely Bloom"
            craft essences which cost 150 Vacuum Tubes each have been selected via the Target column, and the total cost
            of 300 Vacuum Tubes is represented in the cost bar.
            <img alt="Event Page Shop Planner Exclude" src={event_page_shop_planner_exclude} width="100%" />
        </>
    );

    const findAScript = (
        <>
            Story text on the Atlas Academy DB is known as a <b>Script</b>. There are several ways you can find a
            particular quest's script on the DB.
            <ol>
                <li>
                    <b>Script Search</b>
                    <br />
                    You can find the <Link to={`/${region}/scripts`}>Script Search</Link> page from the "Search"
                    dropdown in the navigation bar at the top of the DB page.
                    <img alt="Script Search Page Navigation" src={script_search_page} width="100%" />
                    This page allows you to search through the contents of all the scripts in the game to find the one
                    you are looking for. Make sure to pay attention to the search syntax listed on the page to refine
                    your searches.{" "}
                    <b>
                        Please keep in mind which region you are using the script page on. You cannot search a script
                        using English on the JP page and vice versa.
                    </b>
                </li>
                <li>
                    <b>Via the Wars Page</b>
                    <br />
                    If you don't remember exactly what was said in the script in question to find it via search, but you
                    do remember the singularity or event it was in, you can navigate to the{" "}
                    <Link to={`/${region}/wars`}>Wars</Link> page on the navigation bar, and select the war in question.
                    There, on the rightmost side of each quest, you will see the scripts that quest has available, and
                    can select the one you want. They are sorted into phases, so if the list says <b>1: 10, 11</b>, then
                    you know those two scripts come from phase 1 of the quest. For more details about when the scripts
                    appear in the quest, you can go to the quest's page.
                </li>
                <li>
                    <b>Via the Quests Page</b>
                    <br />
                    If you know what quest your script comes from, you can either utilize the{" "}
                    <Link to={`/${region}/quests`}>Quest Search</Link>, or utilize the{" "}
                    <Link to={`/${region}/wars`}>Wars</Link> page to navigate to the quest you have in mind. There, for
                    each phase of the quest, you can see which scripts are available and when they play in the quest
                    beneath the general quest information. Use the phase row to navigate between phases.
                </li>
            </ol>
        </>
    );

    return {
        id: "wars-quests-events",
        title: "Wars, Quests, Events and Scripts",
        subSections: [
            {
                id: "what-is-a-war",
                title: "What is a War?",
                content: whatIsAWar,
            },
            {
                id: "breakdown-of-the-war-page",
                title: "Breakdown of the War Page",
                content: warBreakDown,
            },
            {
                id: "what-is-a-quest",
                title: "What is a Quest?",
                content: whatIsAQuest,
            },
            {
                id: "breakdown-of-the-quest-page",
                title: "Breakdown of the Quest Page",
                content: questBreakDown,
            },
            {
                id: "where-can-i-find-hunting-and-trial-quests",
                title: "Where can I find Hunting Quests / Trial Quests?",
                content: huntingQuest,
            },
            {
                id: "what-is-an-event",
                title: "What is an Event / How are Events and Wars Different?",
                content: whatIsAnEvent,
            },
            {
                id: "breakdown-of-the-event-page",
                title: "Breakdown of the Events Page",
                content: eventBreakDown,
            },
            {
                id: "how-can-i-find-story-text",
                title: "How Can I Find Story Text?",
                content: findAScript,
            },
        ],
    };
};

export default warFaq;
