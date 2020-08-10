import ProfileCommentConditionType from "../Enum/ProfileCommentConditionType";

export interface ProfileComment {
    id: number;
    priority: number;
    condMessage: string;
    comment: string;
    condType: ProfileCommentConditionType;
    condValues?: number[];
    condValue2: number;
}

interface Profile {
    cv: string;
    illustrator: string;
    stats?: {
        strength: string;
        endurance: string;
        agility: string;
        magic: string;
        luck: string;
        np: string;
    }
    comments: ProfileComment[];
}

export default Profile;
