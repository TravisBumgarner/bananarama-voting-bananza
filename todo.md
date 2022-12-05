- [x] Create Room and have others join
    - [x] Redirect home if room doesn't exist
- [x] Let organizer change room state
    - [x] Add subscription for others to get updated
    - [x] Update UI for non room owners
- [ ] ~~Refactor pubsub to be more centralized~~ 
- [ ] Only send subscriptions for a roomId to that roomId

Remaining for MVP

- [x] Be able to add Entries during 'signup'
    - [x] Basic style for Participants
    - [x] Basic style for entries
- [ ] Be able to vote on entries in the voting phase
- [ ] Be able to display results to everyone
    - [ ] Make a "copy results" button
- [x] Standaridze user / member / paritcipant -> user
- [ ] Refactor state to not have members, etc. nested under room. 
- [ ] Add leave room cleanup event
- [ ] Merge dispatches in Room.tsx
- [ ] Create Sentry Project