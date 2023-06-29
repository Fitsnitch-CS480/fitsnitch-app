import PartnerStatusResponse from '../../../react-native-app/shared/models/requests/PartnerStatusResponse';
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import PartnerAssociationPair from "../../../react-native-app/shared/models/PartnerAssociationPair";
import PartnerRequest from "../../../react-native-app/shared/models/PartnerRequest";
import UserService from './UserService';
import { PartnerPair, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
export default class PartnerAssociationService {

    async getRelationshipStatus(pair: PartnerAssociationPair): Promise<PartnerStatusResponse> {
		let partnerRequest = new PartnerRequest(pair.partnerId1, pair.partnerId2);
        let pending = await prisma.partnerRequest.findUnique({
			where: { requester_requestee: partnerRequest }
		});
        if (pending) return new PartnerStatusResponse(RelationshipStatus.PENDING, partnerRequest);

        partnerRequest = new PartnerRequest(pair.partnerId2, pair.partnerId1);
		pending = await prisma.partnerRequest.findUnique({
			where: { requester_requestee: partnerRequest }
		});
        if (pending) return new PartnerStatusResponse(RelationshipStatus.PENDING, partnerRequest);
        
        let approved = await this.getPartnership(pair);
        if (approved) return new PartnerStatusResponse(RelationshipStatus.APPROVED, undefined);;

        return new PartnerStatusResponse(RelationshipStatus.NONEXISTENT, undefined);
    }


    //
    // REQUESTS
    //

    async requestPartnerAssociation(data: PartnerRequest) {
		await prisma.partnerRequest.create({ data });
    }

    async deletePartnerAssociationRequest(data: PartnerRequest) {
		await prisma.partnerRequest.delete({ where: { requester_requestee: data } });
    }
    
    async getRequesteesByRequester(userId:string):Promise<any[]> {
		let requests = await prisma.partnerRequest.findMany({ where: { requester: userId }});
        return new UserService().getExistingUsers(requests.map(r=>r.requestee));
    }
    
    async getRequestersByRequestee(userId:string):Promise<any[]> {
		let requests = await prisma.partnerRequest.findMany({ where: { requestee: userId }});
        return new UserService().getExistingUsers(requests.map(r=>r.requester));
    }

    //
    // APPROVED CONNECTIONS
    //

    async approvePartnerAssociationRequest(request: PartnerRequest) {
        // wait for successsful creation before removing request to catch errors
        let partner = new PartnerAssociationPair(request.requestee, request.requester);
		await prisma.partnerPair.create({ data: partner });
		console.log(request)
		await prisma.partnerRequest.delete({ where: { requester_requestee: request }});
    }
    
    async removePartnerAssociationFromUser(data: PartnerAssociationPair) {
		await prisma.partnerPair.delete({ where: { partnerId1_partnerId2: data } });
    }
    
    async getPartnersOfUser(userId:string):Promise<User[]> {
		let partners = await prisma.partnerPair.findMany({
			where: {
				// Pairs can be saved with either partner as 1 or 2
				OR: [
					{
						partnerId1: userId,
					},
					{
						partnerId2: userId,
					},
				]
			}
		})
        return new UserService().getExistingUsers(partners.map(p => (
			p.partnerId1 === userId ? p.partnerId2 : p.partnerId1
		)));
    }

	async getPartnership(pair: PartnerPair) {
		return await prisma.partnerPair.findFirst({
			where: {
				// Pairs can be saved with either partner as 1 or 2
				OR: [
					{
						partnerId1: pair.partnerId1,
						partnerId2: pair.partnerId2,
					},
					{
						partnerId1: pair.partnerId2,
						partnerId2: pair.partnerId1,
					},
				]
			}
		})
	};

}