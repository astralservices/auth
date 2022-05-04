import { GetRandomEmoji, GetRandomWord } from '@astral/client-utils';
import { supabaseServer } from '@astral/supabase';
import { LastfmProvider, Provider, RobloxProvider } from '@astral/types';
import { NextApiRequest, NextApiResponse } from 'next';
import LastFmApi from 'lastfmapi';

export default async function ProviderHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { provider } = req.query;

  const type = provider[0];

  if (!type) {
    res.status(400).json({
      error: 'Missing provider',
    });
    return;
  }

  const subroutes = provider.slice(1);

  const { user } = await supabaseServer.auth.api.getUser(
    req.headers.authorization?.split(' ')[1]
  );

  switch (req.method) {
    case 'GET': {
      if (subroutes.length === 0) {
        const { data: provider, error } = await supabaseServer
          .from('providers')
          .select('*')
          .eq('type', type)
          .eq('user', user.id)
          .eq('provider_data->>status', 'active');

        if (error) {
          res.status(500).json({
            error: error.message,
          });
          return;
        }

        if (!provider) {
          res.status(404).json({
            error: 'Provider not found',
          });
          return;
        }

        res.status(200).json(provider);
        return;
      } else {
        switch (type) {
          case 'roblox': {
            if (subroutes[0] === 'username') {
              const response = await fetch(
                'https://users.roblox.com/v1/usernames/users',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    usernames: [subroutes[1]],
                    excludeBannedUsers: true,
                  }),
                }
              );
              const json = await response.json();
              if (json.error) {
                res.status(500).json({ error: json.error });
              }
              res.status(200).json(json.data[0]);
            }

            if (subroutes[0] === 'code') {
              const code = [];
              for (let i = 0; i < 6; i++) {
                code.push(GetRandomWord());
              }

              const id = subroutes[1];

              const { data: provider, error } = await supabaseServer
                .from<Provider>('providers')
                .select('*')
                .eq('type', type)
                .eq('user', user.id)
                .eq('provider_id', id);

              if (error) {
                res.status(500).json({
                  error: error.message,
                });
                return;
              }

              if (provider && provider.length > 0) {
                const { data: roAuth, error: roAuthError } =
                  await supabaseServer
                    .from<RobloxProvider>('providers')
                    .update({
                      type: 'roblox',
                      user: user.id,
                      provider_id: id,
                      provider_data: {
                        id,
                        auth_code: code.join(' '),
                        status: 'pending',
                      },
                    })
                    .eq('id', provider[0].id);

                if (roAuthError) {
                  res.status(500).json({ error: roAuthError });
                  return;
                }

                res.status(200).json({
                  code: code.join(' '),
                });

                return;
              } else {
                const { data: roAuth, error: roAuthError } =
                  await supabaseServer
                    .from<RobloxProvider>('providers')
                    .insert({
                      type: 'roblox',
                      user: user.id,
                      provider_id: id,
                      provider_data: {
                        id,
                        auth_code: code.join(' '),
                        status: 'pending',
                      },
                    });

                if (roAuthError) {
                  res.status(500).json({ error: roAuthError });
                  return;
                }

                res.status(200).json({
                  code: code.join(' '),
                });

                return;
              }
            }

            if (subroutes[0] === 'verify') {
              const { data: provider, error } = await supabaseServer
                .from<Provider>('providers')
                .select('*')
                .eq('type', type)
                .eq('user', user.id);

              if (error) {
                res.status(500).json({
                  error: error.message,
                });
                return;
              }

              if (!provider) {
                res.status(404).json({
                  error: 'Provider not found',
                });
                return;
              }

              const response = await fetch(
                'https://users.roblox.com/v1/users/' + subroutes[1],
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
              const json = await response.json();
              if (json.error) {
                res.status(500).json({ error: json.error });
                return;
              }

              const { description }: { description: string } = json;
              if (description.includes(provider[0].provider_data.auth_code)) {
                const { data: roAuth, error: roAuthError } =
                  await supabaseServer
                    .from<RobloxProvider>('providers')
                    .update({
                      type: 'roblox',
                      user: user.id,
                      provider_id: provider[0].provider_id,
                      provider_data: {
                        id: provider[0].provider_id,
                        auth_code: provider[0].provider_data.auth_code,
                        username: json.name,
                        displayName: json.displayName,
                        status: 'active',
                      },
                    })
                    .eq('id', provider[0].id);

                if (roAuthError) {
                  res.status(500).json({ error: roAuthError });
                  return;
                }

                res.status(200).json({
                  status: 'verified',
                });

                return;
              } else {
                res.status(200).json({
                  status: 'Invalid code.',
                });

                return;
              }
            }

            if (subroutes[0] === 'unlink') {
              const { data: provider, error } = await supabaseServer
                .from<Provider>('providers')
                .select('*')
                .eq('type', type)
                .eq('user', user.id);

              if (error) {
                res.status(500).json({
                  error: error.message,
                });
                return;
              }

              if (!provider) {
                res.status(404).json({
                  error: 'Provider not found',
                });
                return;
              }

              const { data: roAuth, error: roAuthError } = await supabaseServer
                .from<RobloxProvider>('providers')
                .delete()
                .eq('id', provider[0].id);

              if (roAuthError) {
                res.status(500).json({ error: roAuthError });
                return;
              }

              res.status(200).json({
                status: 'unlinked',
              });

              return;
            }
            break;
          }

          case 'lastfm': {
            const lfm = new LastFmApi({
              api_key: '9442db9482eca68e62d8980646b18a7a',
              secret: '1438ff911d3ae6e593a6c646f17c10c4',
            });

            if (subroutes[0] === 'url') {
              res.status(200).json({
                url: lfm.getAuthenticationUrl({
                  cb: `${process.env.NEXT_PUBLIC_ONEAUTH_ENDPOINT}/auth/callback/providers/lastfm`,
                }),
              });

              return;
            }

            if (subroutes[0] === 'callback') {
              const { token } = req.query;

              lfm.authenticate(token, async (err, session) => {
                if (err) {
                  res.status(500).json({
                    error: err.message,
                  });
                  return;
                }

                const { data: lfmAuth, error: lfmAuthError } =
                  await supabaseServer
                    .from<LastfmProvider>('providers')
                    .insert({
                      type: 'lastfm',
                      user: user.id,
                      provider_id: session.username,
                      provider_access_token: session.key,
                      provider_data: {
                        status: 'active',
                      },
                    });

                if (lfmAuthError) {
                  res.status(500).json({ error: lfmAuthError });
                  return;
                }

                res.status(200).json({
                  status: 'verified',
                });

                return;
              });
            }

            break;
          }

          default: {
            res.status(400).json({
              error: 'Invalid provider',
            });

            return;
          }
        }
      }
      break;
    }
    case 'POST': {
      const { data: provider, error } = await supabaseServer
        .from<Provider>('providers')
        .select('*')
        .eq('type', type)
        .eq('user', user.id);

      if (error) {
        res.status(500).json({
          error: error.message,
        });
        return;
      }

      if (provider) {
        res.status(400).json({
          error: 'Provider already exists',
        });
        return;
      }
    }
  }
}
