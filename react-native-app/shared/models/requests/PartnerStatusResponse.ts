import RelationshipStatus from "../../constants/RelationshipStatus";
import PartnerRequest from "../PartnerRequest";

export class PartnerStatusResponse {
    constructor(
          public status:RelationshipStatus,
          public request?:PartnerRequest
          ){}
}
