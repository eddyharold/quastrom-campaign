import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCampaignSchema, CreateCampaignDto } from "../../domain/dto/create-campaign-dto";
import { UpdateCampaignDto, updateCampaignSchema } from "../../domain/dto/update-campaign-dto";

export const useCampaignForm = () =>
  useForm<CreateCampaignDto>({
    resolver: zodResolver(createCampaignSchema),
  });

export const useUpdateCampaignForm = () =>
  useForm<UpdateCampaignDto>({
    resolver: zodResolver(updateCampaignSchema),
  });
