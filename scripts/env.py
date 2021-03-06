from os import system

system('clear')

print('Thank you for contributing to ACM!')
print('We will begin by setting up the environment variables')
print('For email username and password, I recommend going to etherial.mail')

# A map of the api secrets
SERVICES = {
    'environment': [
        'env',
        'maintainance',
        'session_secret'
    ],
    'email': [
        'email_username',
        'email_password'
    ],
    'connections': [
        'protocol',
        'host',
    ]
}

def get_env(env_vars, service):
    '''Replaces the variables in firebase project'''
    for env in env_vars:
        val = input('{}: '.format(env))
        if val == '':
            print('Leaving old value')
        else:
            system('firebase functions:config:set {}.{}={}'.format(service, env, val))

    print('Done')
    choice = input('Would you like to save the settings for local development? [Y/n] ')

    if choice.lower() != 'y':
        exit()

    system('firebase functions:config:get > .runtimeconfig.json')

def pick_environment():
    '''Lets the user pick an environment'''
    choices = {'dev', 'staging', 'prod'}
    choice = input('What environment would you like to set up? [dev/staging/prod] ')

    if choice == '':
        print('defaulting to dev')
        system('firebase functions:config:set environment.env=dev')
    elif choice not in choices:
        print('Invalid Option. You must pick either dev or prod')
        exit()
    elif choice == 'dev':
        print('Setting up development environment')
        system('firebase functions:config:set environment.env=development')
    else:
        print('Setting up {} environment'.format(choice))
        system('firebase functions:config:set environment.env={}'.format(choice))

def choose_service():
    '''Asks the user what service they want to configure'''
    svc_choice = input('What service would you like to configure? [environment/email/connections] ')
    if svc_choice == '':
        exit()
    elif svc_choice not in SERVICES:
        print('Sorry, we do not support {} at the moment'.format(svc_choice))
        exit()
    else:
        print('Setting up variables for {} service'.format(svc_choice))
        get_env(SERVICES[svc_choice], svc_choice)


if __name__ == '__main__':
    pick_environment()
    choose_service()
