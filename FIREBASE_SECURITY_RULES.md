# Firebase Security Rules

Deploy these rules to your Firestore console to fix the "Missing or insufficient permissions" error:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to access only their own data
    // Users collection - for user profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Accounts collection - users can only access their own accounts
    match /accounts/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new accounts, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Trades collection - users can only access their own trades
    match /trades/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new trades, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Strategies collection - users can only access their own strategies
    match /strategies/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new strategies, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Checklist template collection - users can only access their own template
    match /checklist_template/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new templates, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Psychology logs collection - users can only access their own logs
    match /psychology_logs/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new logs, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Routines collection - users can only access their own routines
    match /routines/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      // For creating new routines, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
    
    // Transactions collection - users can only access their own transactions
    match /transactions/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId
        && isValidAccountTransaction(request.auth.uid, resource.data.accountId);
      // For creating new transactions, allow if the userId matches the authenticated user
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && isValidAccountTransaction(request.auth.uid, request.resource.data.accountId);
    }
    
    // Helper function to verify the user has access to the account referenced in the transaction
    function isValidAccountTransaction(userId, accountId) {
      // Check if the account exists and belongs to the user
      return exists(/databases/{database}/documents/accounts/$(accountId)) 
        && get(/databases/{database}/documents/accounts/$(accountId)).data.userId == userId;
    }
  }
}
```

## Additional Security Layer

The application includes an additional security layer in the [getAccountTransactions](file:///c:/Users/Wisdom Chinyamu/Documents/Code\my-app/src/services/firebaseService.ts#L327-L377) function that:

1. First verifies that the account exists
2. Confirms that the authenticated user owns the account
3. Only then attempts to retrieve transactions for that account
4. Includes an additional safety check in the query to ensure only transactions belonging to the authenticated user are returned

This provides defense in depth, ensuring that users can only access transactions for accounts they own.

## How to Deploy

To fix the "Missing or insufficient permissions" error:

1. Go to your Firebase Console
2. Navigate to "Firestore Database" 
3. Click on the "Rules" tab
4. Replace the existing rules with the rules above
5. Click "Publish" to deploy the changes

## Explanation

The rules ensure that:

1. Only authenticated users can read/write to collections
2. Users can only access documents where the `userId` field matches their authenticated UID
3. For transactions, an additional check ensures the user has access to the account referenced in the transaction
4. This provides proper data isolation between users
5. The transactions collection now has the required permissions for the getAccountTransactions function to work
6. Additional client-side validation ensures users can only access transactions for accounts they own