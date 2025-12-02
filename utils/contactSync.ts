
import * as Contacts from 'expo-contacts';
import { SocialStorageService } from './socialStorage';
import { FriendRequest } from '@/types/social';
import { StorageService } from './storage';

export interface ContactMatch {
  contactId: string;
  contactName: string;
  phoneNumber: string;
  email?: string;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
}

export const ContactSyncService = {
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      console.log('Contacts permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return false;
    }
  },

  async checkPermission(): Promise<boolean> {
    try {
      const { status } = await Contacts.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking contacts permission:', error);
      return false;
    }
  },

  async getPhoneContacts(): Promise<{ name: string; phoneNumbers: string[]; emails: string[] }[]> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        console.log('No contacts permission');
        return [];
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
        ],
      });

      console.log(`Retrieved ${data.length} contacts from device`);

      return data.map(contact => ({
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown',
        phoneNumbers: (contact.phoneNumbers || []).map(pn => this.normalizePhoneNumber(pn.number || '')),
        emails: (contact.emails || []).map(e => e.email?.toLowerCase() || '').filter(e => e),
      })).filter(contact => contact.phoneNumbers.length > 0 || contact.emails.length > 0);
    } catch (error) {
      console.error('Error getting phone contacts:', error);
      return [];
    }
  },

  normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const normalized = phoneNumber.replace(/\D/g, '');
    
    // If the number starts with 1 and is 11 digits, remove the leading 1 (US country code)
    if (normalized.length === 11 && normalized.startsWith('1')) {
      return normalized.substring(1);
    }
    
    return normalized;
  },

  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  },

  async findMatchingUsers(phoneNumbers: string[], emails: string[]): Promise<ContactMatch[]> {
    try {
      const normalizedNumbers = phoneNumbers.map(num => this.normalizePhoneNumber(num));
      const normalizedEmails = emails.map(email => this.normalizeEmail(email));
      
      console.log(`Searching for matches with ${normalizedNumbers.length} phone numbers and ${normalizedEmails.length} emails`);
      
      // In production, this would be an API call to your backend
      // For now, we'll simulate with mock data
      const mockUsers = await this.getMockUsers();
      
      const matches: ContactMatch[] = [];
      const matchedUserIds = new Set<string>();
      
      for (const user of mockUsers) {
        // Skip if already matched
        if (matchedUserIds.has(user.userId)) {
          continue;
        }

        // Check phone number match
        const userPhone = this.normalizePhoneNumber(user.phoneNumber);
        const phoneMatch = normalizedNumbers.includes(userPhone);
        
        // Check email match
        const userEmail = this.normalizeEmail(user.email);
        const emailMatch = normalizedEmails.includes(userEmail);
        
        if (phoneMatch || emailMatch) {
          matches.push({
            contactId: user.userId,
            contactName: user.displayName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            userId: user.userId,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
          });
          matchedUserIds.add(user.userId);
        }
      }
      
      console.log(`Found ${matches.length} matching users`);
      return matches;
    } catch (error) {
      console.error('Error finding matching users:', error);
      return [];
    }
  },

  async getMockUsers(): Promise<{ 
    userId: string; 
    username: string; 
    displayName: string; 
    phoneNumber: string; 
    email: string;
    avatar?: string;
  }[]> {
    // This simulates a backend database of users
    // In production, you would fetch this from your API
    // The API would search your user database for matching phone numbers and emails
    return [
      {
        userId: 'user_mock_1',
        username: 'tiger_woods',
        displayName: 'Tiger Woods',
        phoneNumber: '+15551234567',
        email: 'tiger@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      },
      {
        userId: 'user_mock_2',
        username: 'rory_mcilroy',
        displayName: 'Rory McIlroy',
        phoneNumber: '+15559876543',
        email: 'rory@example.com',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      },
      {
        userId: 'user_mock_3',
        username: 'jordan_spieth',
        displayName: 'Jordan Spieth',
        phoneNumber: '+15555551234',
        email: 'jordan@example.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
    ];
  },

  async syncContactsAndFindFriends(): Promise<ContactMatch[]> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.log('Contacts permission denied');
        return [];
      }

      const contacts = await this.getPhoneContacts();
      const allPhoneNumbers = contacts.flatMap(c => c.phoneNumbers);
      const allEmails = contacts.flatMap(c => c.emails);
      
      console.log(`Extracted ${allPhoneNumbers.length} phone numbers and ${allEmails.length} emails from contacts`);
      
      const matches = await this.findMatchingUsers(allPhoneNumbers, allEmails);
      
      return matches;
    } catch (error) {
      console.error('Error syncing contacts:', error);
      return [];
    }
  },

  async sendFriendRequest(toUserId: string, toUsername: string, toDisplayName: string, toAvatar?: string): Promise<void> {
    try {
      const currentUserId = await SocialStorageService.getCurrentUserId();
      const profile = await StorageService.getProfile();
      
      const request: FriendRequest = {
        id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: currentUserId,
        fromUsername: profile?.username || 'You',
        fromDisplayName: profile?.username || 'You',
        fromAvatar: profile?.avatar,
        toUserId,
        status: 'pending',
        createdAt: new Date(),
      };

      await SocialStorageService.saveFriendRequest(request);
      
      // In production, this would send a notification to the other user via your backend
      console.log(`Friend request sent to ${toUsername}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },
};
