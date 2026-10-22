Vagrant.configure("2") do |config|
  config.vm.box = "generic/ubuntu2204"
  config.vm.hostname = "garderie-vm"

  # Hyper-V : pas de dossier synchronisé SMB
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider "hyperv" do |h|
    h.vmname = "garderie-vm"
    h.memory = 2048
    h.cpus = 2
    h.enable_virtualization_extensions = false
    h.linked_clone = true
  end

    # IP demandée par le sujet (ajoutée à la carte réseau de la VM)
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    ip addr add 192.168.56.10/24 dev eth0 || true
  SHELL

   config.vm.provision "shell", run: "always", inline: <<-SHELL
    systemctl disable --now systemd-resolved || true
    rm -f /etc/resolv.conf
    printf "nameserver 8.8.8.8\nnameserver 1.1.1.1\n" > /etc/resolv.conf
  SHELL

  # Ansible installé depuis les dépôts Ubuntu (sans PPA Launchpad)
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    DEBIAN_FRONTEND=noninteractive apt-get install -y ansible
  SHELL

  # Copie des fichiers Ansible dans la VM
  config.vm.provision "file", source: "ansible", destination: "/home/vagrant/ansible"

  # Provisioning Ansible (exécuté dans la VM)
  config.vm.provision "ansible_local" do |a|
    a.provisioning_path = "/home/vagrant/ansible"
    a.playbook = "site.yml"
    a.inventory_path = "inventory.ini"
    a.limit = "all"
    a.install_mode = "default"
  end
end