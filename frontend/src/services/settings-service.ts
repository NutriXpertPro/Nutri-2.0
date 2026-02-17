import api from './api';
import { UserProfile, UpdateUserProfile } from './user-service';

export interface BrandingSettings {
  id?: string;
  logo?: string | File | null;
  signature_image?: string | File | null;
  primary_color: string;
  secondary_color: string;
  business_name: string;
  crn_number: string;
  professional_license: string;
  email_signature: string;
  phone: string;
  address: string;
  document_header: string;
  document_footer: string;
  is_active: boolean;
}

export interface CombinedSettings {
  profile: UserProfile;
  branding: BrandingSettings;
}

export interface UpdateCombinedSettings {
  profile?: UpdateUserProfile;
  branding?: Partial<BrandingSettings>;
}

export const settingsService = {
  async getCombinedSettings(): Promise<CombinedSettings> {
    const [profileResponse, brandingResponse] = await Promise.all([
      api.get<UserProfile>('/users/me/'),
      api.get<BrandingSettings>('/branding/branding/me/')
    ]);

    return {
      profile: profileResponse.data,
      branding: brandingResponse.data
    };
  },

  async updateCombinedSettings(data: UpdateCombinedSettings): Promise<CombinedSettings> {
    const updatePromises = [];

    if (data.profile) {
      // Para atualizar o perfil, precisamos lidar com o upload de arquivos
      const profilePromise = this.updateProfileWithFiles(data.profile);
      updatePromises.push(profilePromise);
    } else {
      updatePromises.push(api.get<UserProfile>('/users/me/'));
    }

    if (data.branding) {
      // Para atualizar o branding, precisamos lidar com o upload de arquivos
      const brandingPromise = this.updateBrandingWithFiles(data.branding);
      updatePromises.push(brandingPromise);
    } else {
      updatePromises.push(api.get<BrandingSettings>('/branding/branding/me/'));
    }

    const [profileResponse, brandingResponse] = await Promise.all(updatePromises);

    return {
      profile: profileResponse.data,
      branding: brandingResponse.data
    };
  },

  async updateProfileWithFiles(data: UpdateUserProfile) {
    const formData = new FormData();
    let isFormData = false;

    console.log('[SettingsService] updateProfileWithFiles:', {
      hasProfilePicture: data.profile_picture !== undefined,
      profilePictureType: data.profile_picture ? (data.profile_picture instanceof File ? 'File' : typeof data.profile_picture) : 'undefined',
      profilePictureIsNull: data.profile_picture === null
    });

    // Apenas enviamos profile_picture se não for undefined
    if (data.profile_picture !== undefined) {
      isFormData = true;
      if (data.profile_picture === null) {
        // Enviar string vazia sinaliza ao backend para remover a imagem
        formData.append('profile_picture_file', '');
        console.log('[SettingsService] Adicionado profile_picture_file vazio (remover)');
      } else if (data.profile_picture instanceof File) {
        formData.append('profile_picture_file', data.profile_picture);
        console.log('[SettingsService] Adicionado profile_picture_file File:', data.profile_picture.name);
      }
    } else {
      console.log('[SettingsService] profile_picture é undefined, não adicionando ao FormData');
    }

    if (isFormData) {
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.professional_title !== undefined) formData.append('professional_title', data.professional_title === null ? '' : data.professional_title);
      if (data.gender !== undefined) formData.append('gender', data.gender === null ? '' : data.gender);

      // DRF com MultiPartParser não aninha automaticamente settings.theme.
      // Vamos enviar como strings no FormData.
      if (data.settings) {
        if (data.settings.theme !== undefined) formData.append('settings.theme', data.settings.theme);
        if (data.settings.language !== undefined) formData.append('settings.language', data.settings.language);
        if (data.settings.notifications_email !== undefined) formData.append('settings.notifications_email', String(data.settings.notifications_email));
        if (data.settings.notifications_push !== undefined) formData.append('settings.notifications_push', String(data.settings.notifications_push));
      }

      console.log('[SettingsService] Enviando FormData para /users/me/');
      return api.patch('/users/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Se não há arquivo, enviamos como JSON normal para manter o aninhamento do DRF
      console.log('[SettingsService] Enviando JSON para /users/me/');
      return api.patch('/users/me/', data);
    }
  },

  async updateBrandingWithFiles(data: Partial<BrandingSettings>) {
    const formData = new FormData();

    // Adicionar campos de texto
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'logo' && key !== 'signature_image' && key !== 'id' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // Adicionar arquivo de logo se houver mudança
    if (data.logo !== undefined) {
      if (data.logo === null) {
        formData.append('logo', '');
      } else if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      }
    }

    // Adicionar arquivo de assinatura se houver mudança
    if (data.signature_image !== undefined) {
      if (data.signature_image === null) {
        formData.append('signature_image', '');
      } else if (data.signature_image instanceof File) {
        formData.append('signature_image', data.signature_image);
      }
    }

    return api.patch('/branding/branding/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};