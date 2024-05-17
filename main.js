#!/usr/bin/env node

const fs = require("fs");
const PDFDocument = require('pdfkit');
const mustache = require("mustache");

const doc = new PDFDocument({
  size: "LETTER",
  margins: {
    top: 25,
    bottom: 25,
    left: 50,
    right: 50
  }
});

const filename = (process.argv[2] && process.argv[2].length ? process.argv[2] : "SRW_RESUME.pdf");
console.log(filename);

var writeStream = fs.createWriteStream(filename)
doc.pipe(writeStream);
// writeStream.on('finish', () => {pass;});

doc.info = Object.assign({}, doc.info, {
  Title: "Shawn Wilson's Resume",
  Subject: "Shawn Wilson's Resume",
  Author: "Shawn Wilson",
  Creator: "Shawn Wilson"
});

const contact = {
  fname: "Shawn",
  lname: "Wilson",
  email: "srwilson@ioswitch.dev",
  pgp_fpr: "BD8A 77EE 8991 9B51 5D73 E795 B8AB 96D5 2BF0 B6D4",
  street: "400 Perkins St., #102",
  city: "Oakland",
  state: "CA",
  zip: "94610",
  phone: "(202) 505-3363"
};

// left column of header table
doc.fontSize(12);
doc.font('fonts/Carlito-Bold.ttf');
doc.text(
    mustache.render(
      "{{ fname }} {{ lname }}", contact
    )
  );

doc.fontSize(10);
doc.font('fonts/Carlito-Italic.ttf');
doc.fillColor('blue');
doc.text(
    mustache.render(
      "{{ email }}", contact
    ), {
      link: "mailto:" + contact.email,
      underline: true
    }
  );

doc.font('fonts/Carlito-Regular.ttf');
doc.fillColor('black');
doc.text("PGP Fingerprint", {
      underline: true,
      continued: true
    }
  )
  .text(
    mustache.render(
      ": {{ pgp_fpr }}", contact
    ), {
      underline: false
    }
  );

// right column of header table
doc.font('fonts/Carlito-Bold.ttf');
doc.text(
    mustache.render(
      "{{ street }}", contact
    ), 450, 30, {
      width: 100,
      align: "right"
    }
  );
doc.text(
    mustache.render(
      "{{ city }}, {{ state }} {{ zip}}", contact
    ), {
      width: 100,
      align: "right"
    }
  );
doc.text(
    mustache.render(
      "{{ phone }}", contact
    ), {
      width: 100,
      align: "right"
    }
  );

// Professional Summary
doc.fontSize(11);
doc.font('fonts/Carlito-Bold.ttf');
doc.text("PROFESSIONAL SUMMARY:", 
    50, 75, {
      underline: true
    }
  ).moveDown(0.25);
  
doc.font('fonts/Carlito-Regular.ttf');
doc.fontSize(9);
doc.text("Experience in:", 60);
doc.list([
    "Writing queries in SQL, XPath, and REST",
    "DSLs: jq, yq, xml, TeX, Rego, AWK, bpftrace, make",
    "x509, ocsp/crl, fpki, and extended UIDs in general",
    "Crypto hardware: HSMs, smartcards, pgpcard, FIDO, and HC Vault/KMS/secrets management systems",
    "Logging: Splunk, Elastic, logstash, fluentbit, syslog"
  ], {
    listType: 'bullet',
    bulletRadius: 1,
    bulletIndent: 40,
    textIndent: 10,
    indent: 10
  }).moveDown(0.25);
doc.text("Deep knowledge of:", 60);
doc.list([
    "regex and globs",
    "Bash, Perl, Ruby, Python, JavaScript",
    "Linux (including some kernel level module/udev/bpf topics)",
    "git (refer to my blog post on it - see link below)",
    "IaC: Chef, Ansible, AWS Cloudformation, and Terraform"
  ], {
    listType: 'bullet',
    bulletRadius: 1,
    bulletIndent: 40,
    textIndent: 10,
    indent: 10
  }).moveDown(0.25);

// Activities
doc.fontSize(11);
doc.font('fonts/Carlito-Bold.ttf');
doc.text("ACTIVITIES:", 
    50, 235, {
      underline: true
    }
  ).moveDown(0.25);
  
doc.font('fonts/Carlito-Regular.ttf');
doc.fontSize(9);
doc.text(
  "I have been writing blog posts (and supporting code) about Linux firewall deployments, systemd, linux containers. I am studying " +
  "for the professional Kubernetes certificates, creating a python based secrets management solution, learning rust, and extending " +
  "the Grype database. I’m an Extra class Amateur Radio operator. I publish a blog on random technologies that interest me."
).moveDown(0.25);

const links = {
  "Blog": "https://ioswitch.dev",
  "GitHub": "https://github.com/ag4ve",
  "LinkedIn": "https://linkedin.com/in/ag4ve",
  "nftables": "https://github.com/ag4ve/nft-policy",
  "bash libs": "https://github.com/ag4ve/bash-libs",
  "mon-hosts": "https://github.com/ag4ve/misc-scripts/blob/master/mon-hosts-packed",
  "bashpack": "https://github.com/ag4ve/misc-scripts/blob/master/bashpack.pl",
  "tmux-start": "https://github.com/ag4ve/misc-scripts/blob/master/tmux-start.sh",
};

// left column
doc.text(null, 60, 285, {continued: true});

for (const label of ["Blog", "GitHub", "LinkedIn", "nftables"]) {
  doc.text(label + ": ", {
        continued: true
      }
    ).fillColor('blue')
    .text(links[label], {
      link: links[label]
    }).fillColor("black");
}

// right column
doc.text(null, 250, 285, {continued: true});

for (const label of ["bash libs", "mon-hosts", "bashpack", "tmux-start"]) {
  doc.text(label + ": ", {
        continued: true
      }
    ).fillColor('blue')
    .text(links[label], {
      link: links[label]
    }).fillColor("black");
}

const history = [{
    title: "Systems Admin",
    company: "KoreLogic Security",
    location: "Deale, MD",
    sdate: "Dec 2012",
    edate: "Dec 2015",
    role: [
      "Maintained Gentoo and Ubuntu Linux systems at three different geographic locations",
      "Was responsible for maintaining two physical racks at a datacenter in Maryland and " + 
        "recommanding new hardware and processes that included password cracking hardware, " +
        "Raritan KVMs, and other hardware",
      "Wrote a Perl script that analyzes and efficiently presents data from iptables log lines",
      "Wrote a Perl module that generates iptables rules from a Perl data structure (NF-Save)",
      "Wrote a Bash script that starts tmux sessions and runs predefined commands",
      "Wrote a Perl script that packs sourced bash 'modules' sourced from a script",
      "Wrote a bash script to monitor hosts (mon-hosts)"
    ]
  }, {
    title: "Senior Systems Admin",
    company: "Innotac (contract to USCIS)",
    location: "Falls Church, VA",
    sdate: "Feb 2016",
    edate: "July 2020",
    role: [
      "Worked with 3 AWS accounts containing multiple VPCs to their own Cisco " +
        "CSR/DirectConnect and multiple deployments/environments in each account",
      "Managed certificates in both KMS and ACM",
      "Designed and implemented a deployment strategy for RHEL/CentOS Linux " +
        "systems in AWS (created shell scripts, cloudformation templates, updated " +
        "packer scripts, chef cookbooks)",
      "Managed two coworkers to upgrade a large Chef environment (from version 11 " +
        "to 14) that over 300 endpoints relied on, repo cleanup, and supermarket " +
        "deployment",
      "Implemented Hashicorp Vault (including OIDC sign in and AWS instance " +
        "authentication for host secrets)",
      "Created a chef resource (LWRP) to create iptables rules from " +
        "protocol/application rule definitions and created a Splunk dashboard " +
        "to show iptables log data across all servers",
      "Was responsible for managing all host based firewalls for all ICAM Linux servers",
      "Investigated and explained or remediated security audit findings",
      "Made sure that deployments only used internal resources (using Sonotype " +
        "Nexus and proxy pip/gem repos and local configurations)",
      "Created Groovy libraries and workflows to allow push button " +
        "deployments and environment updates in Jenkins",
      "Created/maintained Chef and Jenkins integrations with each other and " +
        "AWS (boto3), packer, vault, Chef Minimart, etc."
    ]
  }, {
    title: "Junior Vulnerability Management Engineer",
    company: "Jacobs",
    location: "Herndon, VA",
    sdate: "Jan 2021",
    edate: "Aug 2021",
    role: [
      "Analyzed remediation and false positive submissions for accuracy",
      "Started the process of migrating the desktop application used to upload ",
        "scans and generate a reports to a Node.JS webapp that I was writing",
      "Built a PowerShell script to flag false positives"
    ]
  }, {
    title: "Senior DevOps Engineer",
    company: "Jotform",
    location: "San Francisco, CA",
    sdate: "Nov 2022",
    edate: "Oct 2023",
    role: [
      "Maintained Ubuntu Linux servers and infrastructure on Google Cloud platform",
      "Created new Terraform modules and Ansible roles",
      "Investigated metrics and SLA/SLO/SLI reporting with Prometheus, SigNoz, " +
        "DataDog, and GCP metrics",
      "Recommended best practices for structuring ansible deployments including: " +
        "using AWX Jenkins workers, molecule, separate role based repos, and " +
        "utilizing a secrets management system",
      "Wrote a Bash script to look at each cert running on a server and " +
        "report on how many days until each cert expired"
    ]
  }
];

doc.fontSize(11);
doc.font('fonts/Carlito-Bold.ttf');
doc.text("PROFESSIONAL EXPERIENCE:", 
    50, 335, {
      underline: true
    }
  );
  
doc.fontSize(9);
for (let i = history.length -1; i >= 0; i--) {
  doc.moveDown(0.25);
  doc.font('fonts/Carlito-Bold.ttf')
    .text(
      mustache.render(
        "{{ title }}, {{ company }} -- ", history[i]
      ), {
        continued: true
      });
  doc.font('fonts/Carlito-Regular.ttf')
    .text(
      mustache.render(
        "{{ location }}  {{ sdate }} - {{ edate }}", history[i]
      ));
  doc.list(history[i].role, {
      listType: 'bullet',
      bulletRadius: 1,
      bulletIndent: 40,
      textIndent: 10,
      indent: 10
    });
}

doc.end();

