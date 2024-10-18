import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  lastMessageAt: string;
}

interface ConversationsState {
  list: Conversation[];
  selectedConversation: string | null;
}

const initialState: ConversationsState = {
  list: [],
  selectedConversation: null,
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.list = action.payload;
    },
    selectConversation: (state, action: PayloadAction<string>) => {
      state.selectedConversation = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.list.push(action.payload);
    },
  },
});

export const { setConversations, selectConversation, addConversation } =
  conversationsSlice.actions;
export default conversationsSlice.reducer;
