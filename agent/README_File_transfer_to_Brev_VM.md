## 🗂️ File Transfer Between Local Machine and Brev VM

This guide explains how to transfer files **to and from** your Brev VM instance using the `brev` CLI.
It works for any file — datasets, checkpoints, scripts, models, archives, etc.

---

### 🧩 Context

* **Local environment example:**

  ```
  /Users/<your_username>/Desktop/NVIDIA_hackathon/vibe-edit/agent/
  ```
* **Brev VM environment:**

  ```
  ubuntu@brev-b88bt0r7a:/home/ubuntu/maestro/
  ```
* **Active Brev project:**

  ```
  NAME: build-an-agent-workshop-8655f9
  ID:   b88bt0r7a
  ```

> You can verify your project name anytime using:
>
> ```bash
> brev ls
> ```

Example output:

```
NAME                            STATUS   BUILD      SHELL  ID         MACHINE
build-an-agent-workshop-8655f9  RUNNING  COMPLETED  READY  b88bt0r7a  a100-80gb.1x (gpu)
```

---

## 🔼 Uploading Files (Local → Brev VM)

Use the `brev cp` command from your **local terminal**, not inside the VM.

### Example

```bash
brev cp ./<filename> build-an-agent-workshop-8655f9:/home/ubuntu/maestro/data/
```

**Example use cases**

```bash
# Upload a model checkpoint
brev cp ./model.ckpt build-an-agent-workshop-8655f9:/home/ubuntu/maestro/checkpoints/

# Upload a compressed archive
brev cp ./vectorstore.tar.gz build-an-agent-workshop-8655f9:/home/ubuntu/maestro/data/

# Upload a Python script
brev cp ./run_agent.py build-an-agent-workshop-8655f9:/home/ubuntu/maestro/
```

**Notes**

* The path after the colon `:` refers to the destination inside the VM.
* The `brev cp` command automatically handles secure tunneling — no need for `scp` or private IPs.

---

## 🔽 Downloading Files (Brev VM → Local)

You can also copy results, logs, or generated data *from* your VM to your local computer.

### Example

```bash
brev cp build-an-agent-workshop-8655f9:/home/ubuntu/maestro/output.log ./output.log
```

**Example use cases**

```bash
# Download trained model weights
brev cp build-an-agent-workshop-8655f9:/home/ubuntu/maestro/models/best.pt ./models/

# Download processed data folder
brev cp -r build-an-agent-workshop-8655f9:/home/ubuntu/maestro/data/processed ./data_local/
```

---

## 🔍 Verifying Files on the VM

Once a file is uploaded, SSH into the VM to confirm:

```bash
brev ssh build-an-agent-workshop-8655f9
ls /home/ubuntu/maestro/data/
```

Expected output:

```
vectorstore.tar.gz  dataset.csv  model.ckpt
```

---

## ⚙️ Common Commands Summary

| Action                    | Command                                                            | Run From  |
| ------------------------- | ------------------------------------------------------------------ | --------- |
| Check available instances | `brev ls`                                                          | Local     |
| Connect to your VM        | `brev ssh build-an-agent-workshop-8655f9`                          | Local     |
| Upload file/folder        | `brev cp ./local_path build-an-agent-workshop-8655f9:/remote_path` | Local     |
| Download file/folder      | `brev cp build-an-agent-workshop-8655f9:/remote_path ./local_path` | Local     |
| Verify inside VM          | `ls /home/ubuntu/...`                                              | Inside VM |

---

## ⚠️ Troubleshooting

| Issue                        | Cause                              | Fix                                             |
| ---------------------------- | ---------------------------------- | ----------------------------------------------- |
| `scp` timeout on `172.x.x.x` | Private IP not accessible from Mac | Always use `brev cp` instead of `scp`           |
| `instance not found`         | Wrong project name                 | Check with `brev ls`                            |
| `unknown command cp`         | Outdated Brev CLI                  | Update using `brew update && brew upgrade brev` |
| `Permission denied`          | Target directory doesn’t exist     | SSH into VM and run `mkdir -p /home/ubuntu/...` |

---

## ✅ Example Full Workflow

### 1. Upload file

```bash
cd /Users/kis/Desktop/NVIDIA_hackathon/vibe-edit/agent
brev cp vectorstore.tar.gz build-an-agent-workshop-8655f9:/home/ubuntu/maestro/data/
```

### 2. Verify inside VM

```bash
brev ssh build-an-agent-workshop-8655f9
ls /home/ubuntu/maestro/data
```

### 3. (Optional) Extract archive

```bash
cd /home/ubuntu/maestro/data
tar -xvzf vectorstore.tar.gz
```

### 4. Download results

```bash
brev cp build-an-agent-workshop-8655f9:/home/ubuntu/maestro/output.log ./output.log
```
