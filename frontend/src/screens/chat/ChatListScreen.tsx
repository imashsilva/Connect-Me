import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../../components/common/Avatar';
import { RootStackParamList } from '../../navigation/type';
import { Chat } from '../../types/chat';
import { User } from '../../types/user';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';

export const ChatListScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { logout, user } = useAuth();
  const { chats, loadChats, isLoading, setActiveChat } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  // Logout handler
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const navigateToChat = (chat: Chat) => {
    setActiveChat(chat);
    navigation.navigate('Chat', {
      chatId: chat.id.toString(),
      chatName: chat.chatName || getChatDisplayName(chat),
    });
  };

  const getChatDisplayName = (chat: Chat): string => {
    if (chat.chatType === 'GROUP') {
      return chat.chatName || 'Group Chat';
    }

    // For individual chats, show the other participant's name
    const otherParticipant = chat.participants.find(p => p.user.id !== user?.id);
    return otherParticipant?.user.displayName || 'Unknown User';
  };

  const getDisplayUser = (chat: Chat) => {
    if (chat.chatType === 'GROUP') {
      return null;
    }

    const otherParticipant = chat.participants.find(p => p.user.id !== user?.id);
    return otherParticipant?.user || null;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const displayUser = getDisplayUser(item);
    const displayName = getChatDisplayName(item);
    const isOnline = displayUser?.isOnline || false;

    useEffect(() => {
      // Add logout button to header temporarily
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ),
      });
    }, [navigation]);

  return (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: colors.card }]}
      onPress={() => navigateToChat(item)}
    >

      <View style={styles.avatarContainer}>
        <Avatar
          user={displayUser || {
            id: item.id,
            username: displayName,
            email: '',
            displayName: displayName,
            profilePicture: '',
            status: '',
            lastSeen: new Date().toISOString(),
            isOnline: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          size={56}
          showOnlineStatus={!!displayUser}
        />
        {item.chatType === 'GROUP' && (
          <View style={styles.groupBadge}>
            <Ionicons name="people" size={12} color="white" />
          </View>
        )}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.time, { color: colors.subtitle }]}>
            {formatTime(item.lastMessageAt)}
          </Text>
        </View>

        <View style={styles.messagePreview}>
          <Text
            style={[
              styles.lastMessage,
              { color: colors.subtitle },
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage?.content || 'No messages yet'}
          </Text>

          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

return (
  <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
    {/* Header */}
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Chats</Text>
      <TouchableOpacity style={styles.newChatButton}>
        <Ionicons name="create-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>

    {/* Search Bar */}
    <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
      <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
        <Ionicons name="search" size={20} color={colors.subtitle} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search chats..."
          placeholderTextColor={colors.subtitle}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.subtitle} />
          </TouchableOpacity>
        )}
              {/* LogOut Button */}
      <View style={styles.container}>
        <Text>Chat List Screen</Text>
        <Text>User: {user?.email}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>

    {/* Chat List */}
    <FlatList
      data={chats}
      renderItem={renderChatItem}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isLoading}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.subtitle} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No conversations yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtitle }]}>
            Start a new chat to begin messaging
          </Text>
        </View>
      }
    />
  </SafeAreaView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newChatButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  groupBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
    button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginRight: 15,
    padding: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
});