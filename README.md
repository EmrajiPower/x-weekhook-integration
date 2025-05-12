## WIP

### CURL sample

#### Notion POST
```
curl -X POST http://localhost:3000/webhook/x \
  -H "Content-Type: application/json" \
  -d '{
    "tweet_create_events": [
      {
        "text": "This is a #nestjs tweet",
        "user": { "screen_name": "testuser" },
        "url": "https://www.google.com",
        "created_at": "2025-05-09T12:00:00Z"
      }
    ]
  }'
```

#### Check user ID for the Twitter API test
```
curl -X GET "https://api.twitter.com/2/users/by/username/NatGeo" \
       -H "Authorization: Bearer [TOKEN]"
```

#### Check Twitter API constraints
```
curl -i -H "Authorization: Bearer [TOKEN]" \
       "https://api.twitter.com/2/users/17471979/tweets?tweet.fields=created_at"
```

