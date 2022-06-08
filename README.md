# Cudurru

The master repo for Cudurru, a platform for facilitating real estate transactions directly between buyers and sellers.

## Dependencies

This project relies on: 
 * [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
 * [Vagrant](https://www.vagrantup.com/downloads.html)
 * [VirtualBox](https://www.virtualbox.org/wiki/Downloads).

## Install

1. Clone repository.

2. Bring up vagrantized VM (from root of project).

  `vagrant up`

## Adding "cudurru.test" to the hosts file

1. Add "10.60.0.2	cudurru.test" on a line in the "/etc/hosts" file.

2. Now you can access "cudurru.test" on your web-browser to test the app.

## Testing changes to the app

1. On the root folder of the project, run:
	
	"vagrant provision"

2. Access "cudurru.test" on your browser and see those changes in effect.

## Merging changes into a feature branch

1. Start by stashing or commiting any local changes in your local feature branch.

2. Switch back to local testnet branch:

	"git checkout testnet"

3. Pull remote testnet to your local testnet branch:
	
	"git pull --rebase"

4. Checkout to local feature branch:
	
	"git checkout <name_of_feature_branch>"

5. Meld in commits from the local testnet branch to your local feature branch:

	"git rebase testnet" 
