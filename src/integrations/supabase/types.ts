export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auto_replies: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          reply_message: string
          trigger_message: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          reply_message: string
          trigger_message: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          reply_message?: string
          trigger_message?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      auto_reply_purchases: {
        Row: {
          amount: number | null
          currency: string | null
          id: string
          payment_id: string | null
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          currency?: string | null
          id?: string
          payment_id?: string | null
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          currency?: string | null
          id?: string
          payment_id?: string | null
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      chat_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          conversation_id: string
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          conversation_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          conversation_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_tasks_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      check_cooldowns: {
        Row: {
          checks_remaining: number | null
          id: string
          last_check_at: string | null
          reset_at: string | null
          user_id: string
        }
        Insert: {
          checks_remaining?: number | null
          id?: string
          last_check_at?: string | null
          reset_at?: string | null
          user_id: string
        }
        Update: {
          checks_remaining?: number | null
          id?: string
          last_check_at?: string | null
          reset_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      check_history: {
        Row: {
          api_response: Json | null
          checked_at: string | null
          id: string
          is_available: boolean
          response_time: number | null
          token_used: string | null
          user_id: string
          username_checked: string
        }
        Insert: {
          api_response?: Json | null
          checked_at?: string | null
          id?: string
          is_available: boolean
          response_time?: number | null
          token_used?: string | null
          user_id: string
          username_checked: string
        }
        Update: {
          api_response?: Json | null
          checked_at?: string | null
          id?: string
          is_available?: boolean
          response_time?: number | null
          token_used?: string | null
          user_id?: string
          username_checked?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_history_token_used_fkey"
            columns: ["token_used"]
            isOneToOne: false
            referencedRelation: "user_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      command_cooldowns: {
        Row: {
          command: string
          id: string
          last_used: string | null
          server_id: string
          user_id: string
        }
        Insert: {
          command: string
          id?: string
          last_used?: string | null
          server_id: string
          user_id: string
        }
        Update: {
          command?: string
          id?: string
          last_used?: string | null
          server_id?: string
          user_id?: string
        }
        Relationships: []
      }
      command_shortcuts: {
        Row: {
          command: string
          created_at: string | null
          created_by: string
          enabled: boolean | null
          id: string
          server_id: string
          shortcut: string
          updated_at: string | null
        }
        Insert: {
          command: string
          created_at?: string | null
          created_by: string
          enabled?: boolean | null
          id?: string
          server_id: string
          shortcut: string
          updated_at?: string | null
        }
        Update: {
          command?: string
          created_at?: string | null
          created_by?: string
          enabled?: boolean | null
          id?: string
          server_id?: string
          shortcut?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "command_shortcuts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "discord_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_hearts: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_hearts_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "profile_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "profile_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      console_logs: {
        Row: {
          id: string
          log_type: string
          message: string
          project_id: string
          timestamp: string | null
        }
        Insert: {
          id?: string
          log_type: string
          message: string
          project_id: string
          timestamp?: string | null
        }
        Update: {
          id?: string
          log_type?: string
          message?: string
          project_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "console_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      content_creators: {
        Row: {
          ai_review: Json | null
          application_data: Json
          created_at: string | null
          id: string
          reviewed_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_review?: Json | null
          application_data: Json
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_review?: Json | null
          application_data?: Json
          created_at?: string | null
          id?: string
          reviewed_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_archived_user1: boolean | null
          is_archived_user2: boolean | null
          is_pinned_user1: boolean | null
          is_pinned_user2: boolean | null
          last_message_at: string | null
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived_user1?: boolean | null
          is_archived_user2?: boolean | null
          is_pinned_user1?: boolean | null
          is_pinned_user2?: boolean | null
          last_message_at?: string | null
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived_user1?: boolean | null
          is_archived_user2?: boolean | null
          is_pinned_user1?: boolean | null
          is_pinned_user2?: boolean | null
          last_message_at?: string | null
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      creator_analytics: {
        Row: {
          created_at: string | null
          creator_id: string
          date: string
          engagement_rate: number | null
          id: string
          new_followers: number | null
          profile_views: number | null
          story_views: number | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          date: string
          engagement_rate?: number | null
          id?: string
          new_followers?: number | null
          profile_views?: number | null
          story_views?: number | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          new_followers?: number | null
          profile_views?: number | null
          story_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_analytics_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "content_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_hints: {
        Row: {
          created_at: string | null
          hint_category: string | null
          hint_text: string
          id: string
        }
        Insert: {
          created_at?: string | null
          hint_category?: string | null
          hint_text: string
          id?: string
        }
        Update: {
          created_at?: string | null
          hint_category?: string | null
          hint_text?: string
          id?: string
        }
        Relationships: []
      }
      discord_profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          credits: number | null
          discriminator: string | null
          email: string | null
          id: string
          level: number | null
          rank: number | null
          reputation: number | null
          updated_at: string | null
          username: string
          xp: number | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          credits?: number | null
          discriminator?: string | null
          email?: string | null
          id: string
          level?: number | null
          rank?: number | null
          reputation?: number | null
          updated_at?: string | null
          username: string
          xp?: number | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          credits?: number | null
          discriminator?: string | null
          email?: string | null
          id?: string
          level?: number | null
          rank?: number | null
          reputation?: number | null
          updated_at?: string | null
          username?: string
          xp?: number | null
        }
        Relationships: []
      }
      discord_servers: {
        Row: {
          added_at: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          added_at?: string | null
          created_at?: string | null
          icon?: string | null
          id: string
          name: string
          owner_id: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          added_at?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      download_stats: {
        Row: {
          created_at: string
          downloaded_at: string
          file_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          downloaded_at?: string
          file_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          downloaded_at?: string
          file_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      file_modifications: {
        Row: {
          created_at: string
          file_id: string
          file_name: string
          file_path: string
          id: string
          modification_type: string
          new_content: string | null
          old_content: string | null
          old_name: string | null
          project_id: string
        }
        Insert: {
          created_at?: string
          file_id: string
          file_name: string
          file_path: string
          id?: string
          modification_type: string
          new_content?: string | null
          old_content?: string | null
          old_name?: string | null
          project_id: string
        }
        Update: {
          created_at?: string
          file_id?: string
          file_name?: string
          file_path?: string
          id?: string
          modification_type?: string
          new_content?: string | null
          old_content?: string | null
          old_name?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_modifications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          status: string
          to_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          status?: string
          to_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          status?: string
          to_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      invite_usage: {
        Row: {
          created_at: string | null
          id: string
          invite_code: string
          invitee_id: string
          inviter_id: string
          purchase_reward_given: boolean | null
          reward_given: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_code: string
          invitee_id: string
          inviter_id: string
          purchase_reward_given?: boolean | null
          reward_given?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_code?: string
          invitee_id?: string
          inviter_id?: string
          purchase_reward_given?: boolean | null
          reward_given?: boolean | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_embeds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          message_id: string
          site_name: string | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          message_id: string
          site_name?: string | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          message_id?: string
          site_name?: string | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_embeds_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reports: {
        Row: {
          additional_info: string | null
          created_at: string | null
          id: string
          message_id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reported_by: string
          reported_user: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          created_at?: string | null
          id?: string
          message_id: string
          reason: Database["public"]["Enums"]["report_reason"]
          reported_by: string
          reported_user: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          created_at?: string | null
          id?: string
          message_id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          reported_by?: string
          reported_user?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          status: string
          to_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          status?: string
          to_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          status?: string
          to_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          is_read: boolean | null
          reply_to_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          is_read?: boolean | null
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          is_read?: boolean | null
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payer_email: string | null
          payment_id: string | null
          payment_method: string | null
          profile_data: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payer_email?: string | null
          payment_id?: string | null
          payment_method?: string | null
          profile_data: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payer_email?: string | null
          payment_id?: string | null
          payment_method?: string | null
          profile_data?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_comments: {
        Row: {
          content: string
          created_at: string | null
          dislikes_count: number | null
          hearts_count: number | null
          id: string
          is_edited: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          parent_id: string | null
          profile_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          dislikes_count?: number | null
          hearts_count?: number | null
          id?: string
          is_edited?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          profile_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          dislikes_count?: number | null
          hearts_count?: number | null
          id?: string
          is_edited?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          profile_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profile_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_projects: {
        Row: {
          avatar_url: string | null
          background_type: string
          background_value: string
          buttons: Json
          created_at: string
          description: string
          footer_text: string
          id: string
          is_verified: boolean | null
          project_id: string
          style_type: string
          title: string
          total_views: number | null
          updated_at: string
          user_id: string
          username: string
          verified_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_type: string
          background_value: string
          buttons?: Json
          created_at?: string
          description?: string
          footer_text?: string
          id?: string
          is_verified?: boolean | null
          project_id: string
          style_type: string
          title?: string
          total_views?: number | null
          updated_at?: string
          user_id: string
          username: string
          verified_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_type?: string
          background_value?: string
          buttons?: Json
          created_at?: string
          description?: string
          footer_text?: string
          id?: string
          is_verified?: boolean | null
          project_id?: string
          style_type?: string
          title?: string
          total_views?: number | null
          updated_at?: string
          user_id?: string
          username?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          discord_id: string
          discriminator: string | null
          email: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          discord_id: string
          discriminator?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          discord_id?: string
          discriminator?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      project_files: {
        Row: {
          content: string | null
          created_at: string | null
          file_name: string
          file_path: string
          id: string
          is_directory: boolean | null
          parent_path: string | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          id?: string
          is_directory?: boolean | null
          parent_path?: string | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          id?: string
          is_directory?: boolean | null
          parent_path?: string | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          bot_id: string | null
          build_logs: string | null
          created_at: string | null
          deployment_status: string | null
          id: string
          language: Database["public"]["Enums"]["project_language"]
          main_file: string | null
          name: string
          railway_deployment_id: string | null
          railway_project_id: string | null
          railway_service_id: string | null
          railway_url: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          url_slug: string
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          build_logs?: string | null
          created_at?: string | null
          deployment_status?: string | null
          id?: string
          language: Database["public"]["Enums"]["project_language"]
          main_file?: string | null
          name: string
          railway_deployment_id?: string | null
          railway_project_id?: string | null
          railway_service_id?: string | null
          railway_url?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          url_slug: string
          user_id: string
        }
        Update: {
          bot_id?: string | null
          build_logs?: string | null
          created_at?: string | null
          deployment_status?: string | null
          id?: string
          language?: Database["public"]["Enums"]["project_language"]
          main_file?: string | null
          name?: string
          railway_deployment_id?: string | null
          railway_project_id?: string | null
          railway_service_id?: string | null
          railway_url?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          url_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      railway_deployments: {
        Row: {
          build_logs: string | null
          created_at: string | null
          deployment_url: string | null
          error_message: string | null
          id: string
          project_id: string
          railway_deployment_id: string | null
          railway_project_id: string
          railway_service_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          build_logs?: string | null
          created_at?: string | null
          deployment_url?: string | null
          error_message?: string | null
          id?: string
          project_id: string
          railway_deployment_id?: string | null
          railway_project_id: string
          railway_service_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          build_logs?: string | null
          created_at?: string | null
          deployment_url?: string | null
          error_message?: string | null
          id?: string
          project_id?: string
          railway_deployment_id?: string | null
          railway_project_id?: string
          railway_service_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "railway_deployments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_usernames: {
        Row: {
          id: string
          is_claimed: boolean | null
          notes: string | null
          saved_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          id?: string
          is_claimed?: boolean | null
          notes?: string | null
          saved_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          id?: string
          is_claimed?: boolean | null
          notes?: string | null
          saved_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      scheduled_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          scheduled_for: string
          sender_id: string
          sent: boolean | null
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          scheduled_for: string
          sender_id: string
          sent?: boolean | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          scheduled_for?: string
          sender_id?: string
          sent?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      server_members: {
        Row: {
          id: string
          is_admin: boolean | null
          joined_at: string | null
          server_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_admin?: boolean | null
          joined_at?: string | null
          server_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_admin?: boolean | null
          joined_at?: string | null
          server_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_members_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "discord_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_notes: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          last_edited_by: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string
          conversation_id: string
          created_at?: string | null
          id?: string
          last_edited_by?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          last_edited_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      starred_files: {
        Row: {
          attachment_id: string
          created_at: string | null
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          attachment_id: string
          created_at?: string | null
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          attachment_id?: string
          created_at?: string | null
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "starred_files_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "message_attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starred_files_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_public: boolean | null
          total_views: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          total_views?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_public?: boolean | null
          total_views?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      story_items: {
        Row: {
          created_at: string | null
          duration: number | null
          file_size: number | null
          id: string
          link_embeds: Json | null
          media_type: string
          media_url: string
          order_index: number | null
          story_id: string
          text_elements: Json | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          link_embeds?: Json | null
          media_type: string
          media_url: string
          order_index?: number | null
          story_id: string
          text_elements?: Json | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          link_embeds?: Json | null
          media_type?: string
          media_url?: string
          order_index?: number | null
          story_id?: string
          text_elements?: Json | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_items_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_recipients: {
        Row: {
          created_at: string | null
          id: string
          is_opened: boolean | null
          opened_at: string | null
          recipient_id: string
          story_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_opened?: boolean | null
          opened_at?: string | null
          recipient_id: string
          story_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_opened?: boolean | null
          opened_at?: string | null
          recipient_id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_recipients_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_replies: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string
          sender_id: string
          story_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id: string
          sender_id: string
          story_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string
          sender_id?: string
          story_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_replies_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewed_at: string | null
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          viewed_at?: string | null
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          viewed_at?: string | null
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          last_interaction_at: string
          streak_count: number | null
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_interaction_at?: string
          streak_count?: number | null
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          last_interaction_at?: string
          streak_count?: number | null
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaks_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_vouchers: {
        Row: {
          amount: number
          code: string
          created_at: string
          currency: string
          expires_at: string
          id: string
          is_used: boolean
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          code?: string
          created_at?: string
          currency?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          currency?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string
          grace_period_end: string | null
          id: string
          paypal_subscription_id: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          auto_renew?: boolean
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string
          grace_period_end?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string
          grace_period_end?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      updates: {
        Row: {
          created_at: string
          created_by: string
          description: string
          footer: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          footer?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          footer?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_data: Json | null
          activity_type: Database["public"]["Enums"]["activity_type"]
          actor_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: Database["public"]["Enums"]["activity_type"]
          actor_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: Database["public"]["Enums"]["activity_type"]
          actor_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          ban_duration: unknown
          banned_at: string | null
          banned_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_permanent: boolean | null
          reason: string
          user_id: string
        }
        Insert: {
          ban_duration?: unknown
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_permanent?: boolean | null
          reason: string
          user_id: string
        }
        Update: {
          ban_duration?: unknown
          banned_at?: string | null
          banned_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_permanent?: boolean | null
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      user_clips: {
        Row: {
          clip_code: string
          conversation_id: string
          created_at: string | null
          id: string
          is_public: boolean | null
          message_ids: Json
          title: string
          user_id: string
        }
        Insert: {
          clip_code: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          message_ids: Json
          title: string
          user_id: string
        }
        Update: {
          clip_code?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          message_ids?: Json
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_clips_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string | null
          first_purchase_made: boolean | null
          free_profiles_available: number | null
          id: string
          total_profiles_created: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_purchase_made?: boolean | null
          free_profiles_available?: number | null
          id?: string
          total_profiles_created?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_purchase_made?: boolean | null
          free_profiles_available?: number | null
          id?: string
          total_profiles_created?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_invites: {
        Row: {
          created_at: string | null
          id: string
          invite_code: string
          updated_at: string | null
          user_id: string
          uses_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_code: string
          updated_at?: string | null
          user_id: string
          uses_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_code?: string
          updated_at?: string | null
          user_id?: string
          uses_count?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_seen_hints: {
        Row: {
          hint_id: string
          id: string
          seen_at: string | null
          user_id: string
        }
        Insert: {
          hint_id: string
          id?: string
          seen_at?: string | null
          user_id: string
        }
        Update: {
          hint_id?: string
          id?: string
          seen_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_seen_hints_hint_id_fkey"
            columns: ["hint_id"]
            isOneToOne: false
            referencedRelation: "dashboard_hints"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          available_found: number | null
          created_at: string | null
          id: string
          last_active: string | null
          tokens_added: number | null
          total_checks: number | null
          user_id: string
        }
        Insert: {
          available_found?: number | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          tokens_added?: number | null
          total_checks?: number | null
          user_id: string
        }
        Update: {
          available_found?: number | null
          created_at?: string | null
          id?: string
          last_active?: string | null
          tokens_added?: number | null
          total_checks?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_status: {
        Row: {
          custom_status: string | null
          custom_status_emoji: string | null
          is_online: boolean | null
          is_typing_in_conversation: string | null
          last_seen: string | null
          user_id: string
        }
        Insert: {
          custom_status?: string | null
          custom_status_emoji?: string | null
          is_online?: boolean | null
          is_typing_in_conversation?: string | null
          last_seen?: string | null
          user_id: string
        }
        Update: {
          custom_status?: string | null
          custom_status_emoji?: string | null
          is_online?: boolean | null
          is_typing_in_conversation?: string | null
          last_seen?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_status_is_typing_in_conversation_fkey"
            columns: ["is_typing_in_conversation"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          paypal_subscription_id: string | null
          plan_type: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          paypal_subscription_id?: string | null
          plan_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_tokens: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          rate_limit_reset: string | null
          token_name: string
          token_value: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          rate_limit_reset?: string | null
          token_name?: string
          token_value: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          rate_limit_reset?: string | null
          token_name?: string
          token_value?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      voucher_generation_log: {
        Row: {
          discord_id: string
          id: string
          last_generated_at: string | null
        }
        Insert: {
          discord_id: string
          id?: string
          last_generated_at?: string | null
        }
        Update: {
          discord_id?: string
          id?: string
          last_generated_at?: string | null
        }
        Relationships: []
      }
      voucher_usage: {
        Row: {
          amount_used: number
          created_at: string | null
          id: string
          used_by: string
          voucher_id: string
        }
        Insert: {
          amount_used?: number
          created_at?: string | null
          id?: string
          used_by: string
          voucher_id: string
        }
        Update: {
          amount_used?: number
          created_at?: string | null
          id?: string
          used_by?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_usage_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          balance: number
          code: string
          created_at: string | null
          created_by_discord_id: string
          id: string
          initial_balance: number
          is_used: boolean | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          balance?: number
          code: string
          created_at?: string | null
          created_by_discord_id: string
          id?: string
          initial_balance?: number
          is_used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          balance?: number
          code?: string
          created_at?: string | null
          created_by_discord_id?: string
          id?: string
          initial_balance?: number
          is_used?: boolean | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_users_friends: {
        Args: { _user1_id: string; _user2_id: string }
        Returns: boolean
      }
      calculate_creator_growth: {
        Args: { p_creator_id: string; p_days?: number }
        Returns: {
          current_value: number
          growth_percentage: number
          metric: string
          previous_value: number
        }[]
      }
      can_user_check: {
        Args: { p_user_id: string }
        Returns: {
          can_check: boolean
          next_check_at: string
          plan_type: string
        }[]
      }
      can_view_story: {
        Args: { _story_id: string; _user_id: string }
        Returns: boolean
      }
      delete_expired_stories: { Args: never; Returns: undefined }
      generate_clip_code: { Args: never; Returns: string }
      generate_invite_code: { Args: never; Returns: string }
      generate_url_slug: { Args: { user_discord_id: string }; Returns: string }
      generate_voucher_code: { Args: never; Returns: string }
      get_ban_info: {
        Args: { _user_id: string }
        Returns: {
          banned_at: string
          expires_at: string
          is_permanent: boolean
          reason: string
        }[]
      }
      get_friend_suggestions: {
        Args: { p_limit?: number; p_offset?: number; p_user_id: string }
        Returns: {
          avatar_url: string
          bio: string
          id: string
          is_friend_of_friend: boolean
          username: string
        }[]
      }
      get_mutual_friends: {
        Args: { current_user_id: string; target_user_id: string }
        Returns: {
          avatar_url: string
          discord_id: string
          id: string
          username: string
        }[]
      }
      get_next_active_token: {
        Args: { p_user_id: string }
        Returns: {
          token_id: string
          token_name: string
          token_value: string
        }[]
      }
      get_story_analytics: {
        Args: { p_days?: number; p_user_id: string }
        Returns: {
          date: string
          stories_count: number
          total_views: number
          unique_viewers: number
        }[]
      }
      has_active_premium: { Args: never; Returns: boolean }
      has_ad_free_subscription: { Args: never; Returns: boolean }
      has_auto_reply_access: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
      is_story_recipient: {
        Args: { _story_id: string; _user_id: string }
        Returns: boolean
      }
      is_user_banned: { Args: { _user_id: string }; Returns: boolean }
      update_last_check: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      activity_type:
        | "friend_added"
        | "profile_updated"
        | "project_created"
        | "file_uploaded"
        | "message_sent"
        | "task_completed"
        | "clip_created"
      app_role: "admin" | "moderator" | "user"
      project_language: "nodejs" | "python" | "typescript" | "html" | "profile"
      project_status: "stopped" | "starting" | "running" | "error"
      report_reason:
        | "spam"
        | "harassment"
        | "inappropriate_content"
        | "hate_speech"
        | "violence"
        | "other"
      report_status: "pending" | "reviewed" | "resolved" | "dismissed"
      subscription_plan: "free" | "basic" | "premium"
      task_status: "pending" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "friend_added",
        "profile_updated",
        "project_created",
        "file_uploaded",
        "message_sent",
        "task_completed",
        "clip_created",
      ],
      app_role: ["admin", "moderator", "user"],
      project_language: ["nodejs", "python", "typescript", "html", "profile"],
      project_status: ["stopped", "starting", "running", "error"],
      report_reason: [
        "spam",
        "harassment",
        "inappropriate_content",
        "hate_speech",
        "violence",
        "other",
      ],
      report_status: ["pending", "reviewed", "resolved", "dismissed"],
      subscription_plan: ["free", "basic", "premium"],
      task_status: ["pending", "completed", "cancelled"],
    },
  },
} as const
