import RelationshipStatus from "../../constants/RelationshipStatus";
import PartnerRequest from "../PartnerRequest";

export default class PartnerStatusResponse {
    constructor(
          public status:RelationshipStatus,
          public request?:PartnerRequest
          ){}
}
