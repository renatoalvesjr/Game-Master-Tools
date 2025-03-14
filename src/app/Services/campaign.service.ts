import {inject, Injectable} from '@angular/core';
import {Campaign} from '../Interfaces/Campaign.interface';
import {WindowRef} from './window.service';
import {BehaviorSubject} from 'rxjs';
import {Request} from '../Interfaces/Request.interface';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  window = inject(WindowRef).getWindow()

  private campaignSubject = new BehaviorSubject<Campaign[]>([]);
  campaigns = this.campaignSubject.asObservable();

  /**
   * Carrega todas as campanhas salvas no diretório 'Campaigns'.
   * A lista de campanhas é atualizada e emitida pela propriedade observável 'campaigns'.
   *
   * Esta função é usada para carregar todas as campanhas salvas no diretório 'Campaigns'.
   * Ela lê o conteúdo de todos os arquivos JSON dentro do diretório e os converte em objetos do tipo Campaign.
   * A lista de campanhas atualizada é emitida pela propriedade observável 'campaigns'.
   */
  async loadAllCampaigns() {
    const request: Request = {
      filePath: 'Campaigns/',
      fileName: '/campaign.json'
    }

    await this.window.electronAPI.returnAllFiles(request).then((value: string[]) => {
      const campaigns: Campaign[] = [];
      value.forEach((value) => {
        campaigns.push(JSON.parse(value) as Campaign);
      });
      this.campaignSubject.next(campaigns);
    })
  }


  /**
   * Returns a campaign with the given ID.
   * @param campaignId The ID of the campaign to be returned.
   * @returns A promise that resolves with the campaign if found, or rejects if not found.
   */
  async getCampaignById(campaignId: string | null): Promise<Campaign> {
    if (campaignId === null || campaignId === undefined) {
      throw new Error('Campaign ID is null or undefined');
    }

    const request: Request = {
      filePath: 'Campaigns/' + campaignId + '/campaign.json',
    }

    try {
      // Read the content of the file
      const value = await this.window.electronAPI.returnFile(request);

      // Convert the JSON string to a Campaign object
      return JSON.parse(value) as Campaign;
    } catch (error) {
      console.error('Error on getCampaignById:', error);
      throw error;
    }
  }

  /**
   * Creates a new campaign and saves it to the file system.
   *
   * This function creates a new campaign by writing its data to a JSON file
   * located in the 'Campaigns' directory. After creating the file, it reloads
   * all campaigns to update the observable list.
   *
   * @param campaign The campaign object to be created and saved.
   * @returns A promise that resolves with the created campaign.
   */
  async createCampaign(campaign: Campaign): Promise<Campaign> {
    const filePath = 'Campaigns/' + campaign.campaignId + '/';
    const fileName = '/campaign.json';
    const content = JSON.stringify(campaign);

    const request: Request = {
      filePath,
      fileName,
      content,
    };

    await this.window.electronAPI.saveFile(request);
    // Reload all campaigns to refresh the observable list
    await this.loadAllCampaigns();
    return campaign;
  }

  async updateCampaign(campaign: Campaign): Promise<void> {
    const filePath = 'Campaigns/' + campaign.campaignId;
    const fileName = '/campaign.json';
    const content = JSON.stringify(campaign);

    const request: Request = {
      filePath,
      fileName,
      content,
    };
    await this.window.electronAPI.saveFile(request);
    await this.loadAllCampaigns();
  }

  /**
   * Deletes a campaign from the file system.
   *
   * This function is used to delete a campaign from the file system and
   * update the observable list of campaigns.
   *
   * @param campaignId The ID of the campaign to be deleted.
   * @returns A promise that resolves when the campaign is deleted.
   */
  async deleteCampaign(campaignId: string): Promise<void> {
    const currentCampaigns = this.campaignSubject.value;
    const updatedCampaigns = currentCampaigns.filter(
      (campaign) => campaign.campaignId !== campaignId
    );
    this.campaignSubject.next(updatedCampaigns);

    const request = {
      filePath: 'Campaigns/' + campaignId + '/',
      fileName: '',
    };

    try {
      await this.window.electronAPI.deleteFile(request);
    } catch (error: any) {
      console.error('Error on deleteCampaign:', error);
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
